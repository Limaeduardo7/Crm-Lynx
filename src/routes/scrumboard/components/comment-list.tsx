import { DeleteButton, useForm } from "@refinedev/antd";
import {
    HttpError,
    useGetIdentity,
    useInvalidate,
    useList,
    useParsed,
} from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import { Button, Form, Input, Space, Typography } from "antd";
import dayjs from "dayjs";

import { CustomAvatar, Text } from "@/components";
import { User } from "@/graphql/schema.types";
import { KanbanTaskCommentsQuery } from "@/graphql/types";

import { useTranslation } from "react-i18next"; // Importe a função useTranslation

import { KANBAN_TASK_COMMENTS_QUERY } from "../kanban/queries";

type TaskComment = GetFieldsFromList<KanbanTaskCommentsQuery>;

const CommentListItem = ({ item }: { item: TaskComment }) => {
    const { t } = useTranslation();
    const invalidate = useInvalidate();
    const { formProps, setId, id, saveButtonProps } = useForm<
        TaskComment,
        HttpError,
        TaskComment
    >({
        resource: "taskComments",
        action: "edit",
        queryOptions: {
            enabled: false,
        },
        onMutationSuccess: () => {
            setId(undefined);
            invalidate({
                invalidates: ["list"],
                resource: "taskComments",
            });
        },
        successNotification: () => ({
            key: "task-update-comment",
            message: t("commentList.successUpdateComment.title"),
            description: t("commentList.successUpdateComment.description"),
            type: "success",
        }),
    });
    const { data: me } = useGetIdentity<User>();

    const isMe = me?.id === item.createdBy.id;

    return (
        <div style={{ display: "flex", gap: "12px" }}>
            <CustomAvatar
                style={{ flexShrink: 0 }}
                alt={item.createdBy.name}
                src={item.createdBy.avatarUrl}
            >
                {item.createdBy.name.charAt(0)}
            </CustomAvatar>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: 500 }}>
                        {item.createdBy.name}
                    </Text>
                    <Text size="xs" style={{ color: "#000000a6" }}>
                        {dayjs(item.createdAt).format("MMMM D, YYYY - h:ma")}
                    </Text>
                </div>

                {id ? (
                    <Form
                        {...formProps}
                        initialValues={{ comment: item.comment }}
                    >
                        <Form.Item
                            name="comment"
                            rules={[
                                {
                                    required: true,
                                    transform(value) {
                                        return value?.trim();
                                    },
                                    message: t("commentList.commentRequired.title"),
                                },
                            ]}
                        >
                            <Input.TextArea
                                autoFocus
                                style={{ backgroundColor: "#fff" }}
                            />
                        </Form.Item>
                    </Form>
                ) : (
                    <Typography.Paragraph
                        style={{
                            background: "#fff",
                            borderRadius: "6px",
                            padding: "8px",
                            marginBottom: 0,
                        }}
                        ellipsis={{ rows: 3, expandable: true }}
                    >
                        {item.comment}
                    </Typography.Paragraph>
                )}

                {isMe && !id && (
                    <Space size={16}>
                        <Typography.Link
                            style={{ color: "inherit", fontSize: "12px" }}
                            onClick={() => setId(item.id)}
                        >
                            {t("commentList.edit.title")}
                        </Typography.Link>
                        <DeleteButton
                            recordItemId={item.id}
                            resource="taskComments"
                            size="small"
                            type="link"
                            icon={null}
                            onSuccess={() => {
                                invalidate({
                                    invalidates: ["list"],
                                    resource: "taskComments",
                                });
                            }}
                            successNotification={() => ({
                                key: "task-delete-comment",
                                message: t("commentList.successDeleteComment.title"),
                                description: t("commentList.successDeleteComment.description"),
                                type: "success",
                            })}
                            style={{
                                padding: 0,
                                fontSize: "12px",
                                color: "inherit",
                            }}
                        />
                    </Space>
                )}

                {id && (
                    <Space>
                        <Button size="small" onClick={() => setId(undefined)}>
                            {t("commentList.cancel.title")}
                        </Button>
                        <Button
                            size="small"
                            type="primary"
                            {...saveButtonProps}
                        >
                            {t("commentList.save.title")}
                        </Button>
                    </Space>
                )}
            </div>
        </div>
    );
};

export const CommentList = () => {
    const { id: taskId } = useParsed();

    const { data } = useList<TaskComment>({
        resource: "taskComments",
        filters: [{ field: "task.id", operator: "eq", value: taskId }],
        sorters: [{ field: "createdAt", order: "desc" }],
        pagination: {
            mode: "off",
        },
        meta: {
            gqlQuery: KANBAN_TASK_COMMENTS_QUERY,
        },
    });

    return (
        <Space size={16} direction="vertical">
            {data?.data?.map((item) => (
                <CommentListItem key={item.id} item={item} />
            ))}
        </Space>
    );
};
