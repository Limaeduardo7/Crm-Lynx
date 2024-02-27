import { useSearchParams } from "react-router-dom";
import { useModalForm } from "@refinedev/antd"; 
import { Form, Input, Modal } from "antd";
import { GetFields } from "@refinedev/nestjs-query";
import { KanbanCreateTaskMutation } from "@/graphql/types";
import { KANBAN_CREATE_TASK_MUTATION } from "./queries";
import { useTranslation } from "react-i18next"; 

export const KanbanCreatePage = () => {
    const [searchParams] = useSearchParams();
    const { formProps, modalProps, close } = useModalForm<
        GetFields<KanbanCreateTaskMutation>
    >({
        action: "create",
        defaultVisible: true,
        meta: { gqlMutation: KANBAN_CREATE_TASK_MUTATION },
    });

    // Use a função useTranslation para obter a função t para tradução
    const { t } = useTranslation();

    const handleCancel = () => {
        close();
        window.history.replaceState(null, "", "/tasks"); 
    };

    return (
        <Modal
            {...modalProps}
            onCancel={handleCancel}
            title={t("kanbanCreatePage.addNewCard")}
            width={512}
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={(values) => {
                    formProps?.onFinish?.({
                        ...values,
                        stageId: searchParams.get("stageId")
                            ? Number(searchParams.get("stageId"))
                            : null,
                        userIds: [],
                    });
                }}
            >
                <Form.Item
                    label={t("kanbanCreatePage.title")}
                    name="title"
                    rules={[{ required: true, message: t("kanbanCreatePage.titleIsRequired") }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
