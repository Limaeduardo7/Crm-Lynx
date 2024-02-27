import { useModalForm } from "@refinedev/antd";
import { useInvalidate, useNavigation } from "@refinedev/core";
import { GetFields } from "@refinedev/nestjs-query";
import { Form, Input, Modal } from "antd";
import { KanbanUpdateStageMutation } from "@/graphql/types";
import { KANBAN_UPDATE_STAGE_MUTATION } from "./queries";
import { useTranslation } from "react-i18next";

export const KanbanEditStage = () => {
    const invalidate = useInvalidate();
    const { list } = useNavigation();
    const { formProps, modalProps, close } = useModalForm<
        GetFields<KanbanUpdateStageMutation>
    >({
        action: "edit",
        defaultVisible: true,
        resource: "taskStages",
        meta: {
            gqlMutation: KANBAN_UPDATE_STAGE_MUTATION,
        },
        onMutationSuccess: () => {
            invalidate({ invalidates: ["list"], resource: "tasks" });
        },
        successNotification: () => {
            return {
                key: "edit-stage",
                type: "success",
                message: t("kanbanEditStage.successMessage"),
                description: t("kanbanEditStage.successDescription"),
            };
        },
    });

    // Use a função useTranslation para obter a função t para tradução
    const { t } = useTranslation();

    return (
        <Modal
            {...modalProps}
            onCancel={() => {
                close();
                list("tasks", "replace");
            }}
            title={t("kanbanEditStage.editStageTitle")}
            width={512}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={t("kanbanEditStage.titleLabel")}
                    name="title"
                    rules={[{ required: true, message: t("kanbanEditStage.titleRequiredMessage") }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
