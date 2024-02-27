import { useModalForm } from "@refinedev/antd";
import { useInvalidate, useNavigation } from "@refinedev/core";
import { Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";

import { SALES_UPDATE_DEAL_STAGE_MUTATION } from "./queries";

export const SalesEditStage = () => {
    const { t } = useTranslation();
    const invalidate = useInvalidate();
    const { list } = useNavigation();

    const { formProps, modalProps, close } = useModalForm({
        action: "edit",
        defaultVisible: true,
        resource: "dealStages",
        meta: {
            gqlMutation: SALES_UPDATE_DEAL_STAGE_MUTATION,
        },
        onMutationSuccess: () => {
            invalidate({ invalidates: ["list"], resource: "deals" });
        },
        successNotification: () => {
            return {
                key: "edit-stage",
                type: "success",
                message: t("salesEditStage.successMessage"),
                description: t("salesEditStage.successDescription"),
            };
        },
    });

    return (
        <Modal
            {...modalProps}
            onCancel={() => {
                list("deals", "replace");
                close();
            }}
            title={t("salesEditStage.editStageTitle")}
            width={512}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={t("salesEditStage.titleLabel")}
                    name="title"
                    rules={[{ required: true, message: t("salesEditStage.titleRequiredMessage") }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
