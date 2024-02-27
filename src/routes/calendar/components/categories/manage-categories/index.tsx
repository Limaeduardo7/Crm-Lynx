import React from "react";
import { useTranslation } from "react-i18next";

import { useCreateMany, useDelete, useList } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Popconfirm } from "antd";

import { Text } from "@/components";
import { EVENT_CATEGORIES_QUERY } from "@/graphql/queries";
import { EventCategoriesQuery } from "@/graphql/types";

import styles from "./index.module.css";
import { CALENDAR_CREATE_EVENT_CATEGORIES_MUTATION } from "./queries";

type CalendarManageCategoriesProps = {
    saveSuccess?: () => void;
    onCancel?: () => void;
    visible?: boolean;
};

export const CalendarManageCategories: React.FC<CalendarManageCategoriesProps> = ({
    saveSuccess,
    onCancel,
    visible,
}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { mutate: createManyMutation } = useCreateMany();
    const { mutate: deleteMutation } = useDelete();
    const { data } = useList<GetFieldsFromList<EventCategoriesQuery>>({
        resource: "eventCategories",
        meta: {
            gqlQuery: EVENT_CATEGORIES_QUERY,
        },
    });

    const handleCancel = () => {
        onCancel && onCancel();
    };

    const handleOk = () => {
        form.submit();
    };

    const handleDeleteCategory = (categoryId: string) => {
        deleteMutation({
            resource: "eventCategories",
            id: categoryId,
            successNotification: () => ({
                key: "event-category-delete",
                message: t("CalendarManageCategories.successfullyDeletedCategory"),
                description: "Successful",
                type: "success",
            }),
        });
    };

    const onFinish = (formValues: { title: string[] }) => {
        if (!formValues?.title || formValues.title.length === 0) {
            saveSuccess && saveSuccess();
            return;
        }

        // remove undefined values
        formValues.title = formValues.title.filter((title) => title !== undefined);

        const values = formValues.title.map((title) => ({ title }));

        createManyMutation(
            {
                resource: "eventCategories",
                meta: {
                    gqlMutation: CALENDAR_CREATE_EVENT_CATEGORIES_MUTATION,
                },
                values,
                successNotification: () => ({
                    key: "event-category-create",
                    message: t("CalendarManageCategories.successfullyCreatedCategories"),
                    description: "Successful",
                    type: "success",
                }),
            },
            {
                onSuccess: () => {
                    saveSuccess && saveSuccess();
                    form.resetFields();
                },
            }
        );
    };

    return (
        <Modal
            title={t("CalendarManageCategories.manageCategories")}
            visible={visible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={t("CalendarManageCategories.save")}
            destroyOnClose
            bodyStyle={{ paddingTop: "1rem" }}
        >
            <div className={styles.container}>
                {data?.data.map((category) => (
                    <div key={category.id} className={styles.category}>
                        <Text className={styles.title}>{category.title}</Text>
                        <Popconfirm
                            title={t("CalendarManageCategories.deleteCategory")}
                            onConfirm={() => handleDeleteCategory(category.id)}
                            okText={t("Yes")}
                            cancelText={t("No")}
                        >
                            <Button
                                type="text"
                                icon={<DeleteOutlined className="tertiary" />}
                            />
                        </Popconfirm>
                    </div>
                ))}

                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.List name="title">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field) => (
                                    <div key={field.key} className={styles.category}>
                                        <Form.Item {...field}>
                                            <Input
                                                className={styles["new-category-input"]}
                                                placeholder={t("CalendarManageCategories.pleaseEnterCategoryTitle")}
                                                bordered={false}
                                            />
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            onClick={() => remove(field.name)}
                                            icon={<DeleteOutlined className="tertiary" />}
                                        />
                                    </div>
                                ))}
                                <div className={styles.category}>
                                    <Button
                                        type="link"
                                        icon={<PlusOutlined />}
                                        onClick={() => add()}
                                        className={styles["new-category-button"]}
                                    >
                                        {t("CalendarManageCategories.addCategory")}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form.List>
                </Form>
            </div>
        </Modal>
    );
};
