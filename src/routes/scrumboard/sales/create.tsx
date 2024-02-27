import { FC, PropsWithChildren, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { useModalForm, useSelect } from "@refinedev/antd";
import {
    HttpError,
    useCreate,
    useGetIdentity,
    useNavigation,
} from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { useTranslation } from "react-i18next";

import {
    DollarOutlined,
    MailOutlined,
    PlusCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Typography,
} from "antd";

import { SelectOptionWithAvatar } from "@/components";
import { Contact, Deal, User } from "@/graphql/schema.types";
import { SalesCompaniesSelectQuery } from "@/graphql/types";
import { useDealStagesSelect } from "@/hooks/useDealStagesSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";

import {
    SALES_COMPANIES_SELECT_QUERY,
    SALES_CREATE_CONTACT_MUTATION,
} from "./queries";

type FormValues = {
    stageId?: string | null;
    companyId?: string;
    dealContactId?: string;
    dealOwnerId?: string;
    title?: string;
    contactName?: string;
    contactEmail?: string;
};

export const SalesCreatePage: FC<PropsWithChildren> = ({ children }) => {
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const { list, replace } = useNavigation();

    const { formProps, modalProps, close } = useModalForm<
        Deal,
        HttpError,
        FormValues
    >({
        action: "create",
        defaultVisible: true,
    });

    useEffect(() => {
        const stageId = searchParams.get("stageId");
        const companyId = searchParams.get("companyId");

        if (stageId) {
            formProps.form?.setFieldsValue({
                stageId,
            });
        }

        if (companyId && companyId !== "null") {
            formProps.form?.setFieldsValue({
                companyId,
            });
        }
    }, [searchParams]);

    const { selectProps, queryResult } = useSelect<
        GetFieldsFromList<SalesCompaniesSelectQuery>
    >({
        resource: "companies",
        optionLabel: "name",
        meta: {
            gqlQuery: SALES_COMPANIES_SELECT_QUERY,
        },
    });

    const { selectProps: stageSelectProps } = useDealStagesSelect();

    const { selectProps: userSelectProps, queryResult: userQueryResult } =
        useUsersSelect();

    const { data: user } = useGetIdentity<User>();

    const { mutateAsync: createMutateAsync } = useCreate<Contact>();

    const companyId = Form.useWatch("companyId", formProps.form);

    useEffect(() => {
        formProps.form?.setFieldValue("dealContactId", undefined);
    }, [companyId]);

    const renderContactForm = () => {
        if (!companyId) {
            return null;
        }

        const selectedCompany = queryResult.data?.data?.find(
            (company) => company.id === companyId,
        );

        const hasContact =
            selectedCompany?.contacts?.nodes?.length !== undefined &&
            selectedCompany.contacts.nodes.length > 0;

        if (hasContact) {
            const options = selectedCompany?.contacts?.nodes?.map(
                (contact) => ({
                    label: (
                        <SelectOptionWithAvatar
                            name={contact.name}
                            avatarUrl={contact.avatarUrl ?? undefined}
                        />
                    ),
                    value: contact.id,
                }),
            );

            return (
                <Form.Item
                    label={t("salesCreatePage.dealContact")}
                    name="dealContactId"
                    rules={[{ required: true }]}
                >
                    <Select options={options} />
                </Form.Item>
            );
        }

        return (
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={t("salesCreatePage.contactName")}
                        name="contactName"
                        rules={[{ required: true }]}
                    >
                        <Input
                            addonBefore={<UserOutlined />}
                            placeholder={t("salesCreatePage.enterContactName")}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={t("salesCreatePage.contactEmail")}
                        name="contactEmail"
                        rules={[{ required: true }]}
                    >
                        <Input
                            addonBefore={<MailOutlined />}
                            placeholder={t("salesCreatePage.enterContactEmail")}
                        />
                    </Form.Item>
                </Col>
            </Row>
        );
    };

    const isHaveOverModal =
        pathname === "/scrumboard/sales/create/company/create";

    return (
        <>
            <Modal
                {...modalProps}
                style={{ display: isHaveOverModal ? "none" : "inherit" }}
                onCancel={() => {
                    close();
                    list(t("salesCreatePage.backToList"));
                }}
                title={t("salesCreatePage.addNewDeal")}
                width={512}
            >
                <Form
                    {...formProps}
                    layout="vertical"
                    onFinish={async (values) => {
                        if (values.contactName && values.contactEmail) {
                            const { data } = await createMutateAsync({
                                resource: "contacts",
                                values: {
                                    name: values.contactName,
                                    email: values.contactEmail,
                                    salesOwnerId: user?.id,
                                    companyId,
                                },
                                meta: {
                                    gqlMutation: SALES_CREATE_CONTACT_MUTATION,
                                },
                            });

                            delete values.contactName;
                            delete values.contactEmail;

                            if (data) {
                                formProps.onFinish?.({
                                    ...values,
                                    dealContactId: data.id,
                                    dealOwnerId: user?.id,
                                });
                            }
                        } else {
                            formProps.onFinish?.(values);
                        }
                    }}
                >
                    <Form.Item
                        label={t("salesCreatePage.dealTitle")}
                        name="title"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder={t("salesCreatePage.enterDealTitle")} />
                    </Form.Item>
                    <Form.Item
                        label={t("salesCreatePage.selectCompany")}
                        name="companyId"
                        rules={[{ required: true }]}
                        extra={
                            <Typography.Link
                                style={{ marginTop: 8, display: "block" }}
                                onClick={() =>
                                    replace(
                                        "company/create?to=/scrumboard/sales/create",
                                    )
                                }
                            >
                                <PlusCircleOutlined /> {t("salesCreatePage.addNewCompany")}
                            </Typography.Link>
                        }
                    >
                        <Select
                            placeholder={t("salesCreatePage.selectCompany")}
                            {...selectProps}
                            options={
                                queryResult.data?.data?.map((company) => ({
                                    value: company.id,
                                    label: (
                                        <SelectOptionWithAvatar
                                            name={company.name}
                                            shape="square"
                                            avatarUrl={company.avatarUrl ?? undefined}
                                        />
                                    ),
                                })) ?? []
                            }
                        />
                    </Form.Item>

                    {renderContactForm()}
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label={t("salesCreatePage.stage")}>
                                <Select
                                    placeholder={t("salesCreatePage.selectStage")}
                                    {...stageSelectProps}
                                    showSearch={false}
                                    options={stageSelectProps.options?.concat({
                                        label: t("salesCreatePage.unassigned"),
                                        value: null,
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                rules={[{ required: true }]}
                                label={t("salesCreatePage.dealValue")}
                                name="value"
                            >
                                <InputNumber
                                    min={0}
                                    addonBefore={<DollarOutlined />}
                                    placeholder="0,00"
                                    formatter={(value) =>
                                        `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ",",
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={t("salesCreatePage.dealOwner")}
                        name="dealOwnerId"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder={t("salesCreatePage.selectUser")}
                            {...userSelectProps}
                            options={
                                userQueryResult.data?.data?.map((user) => ({
                                    value: user.id,
                                    label: (
                                        <SelectOptionWithAvatar
                                            name={user.name}
                                            avatarUrl={user.avatarUrl ?? undefined}
                                        />
                                    ),
                                })) ?? []
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
            {children}
        </>
    );
};
