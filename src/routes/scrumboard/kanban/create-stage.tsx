import { Form, Input, Modal } from "antd";
import { useModalForm } from "@refinedev/antd";
import { useInvalidate, useNavigation } from "@refinedev/core";
import { GetFields } from "@refinedev/nestjs-query";
import { useTranslation } from "react-i18next"; // Importação do hook de internacionalização

import { KanbanCreateStageMutation } from "@/graphql/types";
import { KANBAN_CREATE_STAGE_MUTATION } from "./queries";

export const KanbanCreateStage = () => {
    const { t } = useTranslation(); // Hook de internacionalização
    const invalidate = useInvalidate();
    const { list } = useNavigation();
    const { formProps, modalProps, close } = useModalForm<
        GetFields<KanbanCreateStageMutation>
    >({
        action: "create",
        defaultVisible: true,
        resource: "taskStages",
        meta: {
            gqlMutation: KANBAN_CREATE_STAGE_MUTATION,
        },
        onMutationSuccess: () => {
            invalidate({ invalidates: ["list"], resource: "tasks" });
        },
        successNotification: () => {
            return {
                key: "create-stage",
                type: "success",
                message: t("kanbanCreateStage.successfullyCreatedStage"), // Internacionalização da mensagem de sucesso
                description: "Successful",
            };
        },
    });

    return (
        <Modal
            {...modalProps}
            onCancel={() => {
                close();
                list("tasks", "replace");
            }}
            title={t("kanbanCreateStage.addNewStage")} // Internacionalização do título do modal
            width={512}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={t("kanbanCreateStage.title")} // Internacionalização do rótulo do campo
                    name="title"
                    rules={[{ required: true, message: t("kanbanCreateStage.titleIsRequired") }]} // Internacionalização da mensagem de campo obrigatório
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
