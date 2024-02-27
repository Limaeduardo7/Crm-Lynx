import { FC } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importação do hook useTranslation

import { useModalForm } from "@refinedev/antd";
import { HttpError, RedirectAction, useNavigation } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Spin } from "antd";

import {
    QuotesCreateQuoteMutation,
    QuotesCreateQuoteMutationVariables,
} from "@/graphql/types";
import { useCompaniesSelect } from "@/hooks/useCompaniesSelect";
import { useContactsSelect } from "@/hooks/useContactsSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";

import {
    QUOTES_CREATE_QUOTE_MUTATION,
    QUOTES_UPDATE_QUOTE_MUTATION,
} from "../../queries";

type Props = {
    action: "create" | "edit";
    redirect?: RedirectAction;
    onMutationSuccess?: () => void;
    onCancel?: () => void;
};

export const QuotesFormModal: FC<Props> = ({
    action,
    redirect,
    onCancel,
    onMutationSuccess,
}) => {
    const { t } = useTranslation(); // Uso do hook useTranslation
    const { pathname } = useLocation();
    const params = useParams<{ id: string }>();
    const { list, replace } = useNavigation();
    const [searchParams] = useSearchParams();

    const { formProps, modalProps, close } = useModalForm<
        GetFields<QuotesCreateQuoteMutation>,
        HttpError,
        GetVariables<QuotesCreateQuoteMutationVariables>
    >({
        resource: "quotes",
        action,
        id: params.id,
        defaultVisible: true,
        redirect,
        meta: {
            gqlMutation:
                action === "create"
                    ? QUOTES_CREATE_QUOTE_MUTATION
                    : QUOTES_UPDATE_QUOTE_MUTATION,
        },
        onMutationSuccess: () => {
            onMutationSuccess?.();
        },
    });

    const {
        selectProps: selectPropsCompanies,
        queryResult: { isLoading: isLoadingCompanies },
    } = useCompaniesSelect();

    const {
        selectProps: selectPropsContacts,
        queryResult: { isLoading: isLoadingContact },
    } = useContactsSelect();

    const {
        selectProps: selectPropsSalesOwners,
        queryResult: { isLoading: isLoadingSalesOwners },
    } = useUsersSelect();

    const loading =
        isLoadingCompanies || isLoadingContact || isLoadingSalesOwners;

    const isHaveOverModal = pathname.includes("company-create");

    return (
        <Modal
            {...modalProps}
            confirmLoading={loading}
            width={560}
            style={{ display: isHaveOverModal ? "none" : "inherit" }}
            onCancel={() => {
                if (onCancel) {
                    onCancel();
                    return;
                }
                //TODO: modalProps.onCancel expect an event so, I used close. Actually both of them are same.
                close();
                list("quotes", "replace");
            }}
        >
            <Spin spinning={loading}>
                <Form {...formProps} layout="vertical">
                    <Form.Item
                        rules={[{ required: true }]}
                        name="title"
                        label={t("QuotesFormModal.selectTitle")}
                    >
                        <Input placeholder={t("QuotesFormModal.enterQuoteTitle")} />
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: true }]}
                        name={["salesOwnerId"]}
                        initialValue={formProps?.initialValues?.salesOwner?.id}
                        label={t("QuotesFormModal.selectSalesOwner")}
                    >
                        <Select
                            {...selectPropsSalesOwners}
                            placeholder={t("QuotesFormModal.selectUser")}
                        />
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: true }]}
                        name={["companyId"]}
                        initialValue={
                            searchParams.get("companyId") ??
                            formProps?.initialValues?.company?.id
                        }
                        label={t("QuotesFormModal.selectCompany")}
                        extra={
                            <Button
                                style={{ paddingLeft: 0 }}
                                type="link"
                                icon={<PlusCircleOutlined />}
                                onClick={() =>
                                    replace(`company-create?to=${pathname}`)
                                }
                            >
                                {t("QuotesFormModal.addNewCompany")}
                            </Button>
                        }
                    >
                        <Select
                            {...selectPropsCompanies}
                            placeholder={t("QuotesFormModal.selectCompany")}
                        />
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: true }]}
                        name={["contactId"]}
                        initialValue={formProps?.initialValues?.contact?.id}
                        label={t("QuotesFormModal.selectContact")}
                    >
                        <Select
                            {...selectPropsContacts}
                            placeholder={t("QuotesFormModal.selectContact")}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};
