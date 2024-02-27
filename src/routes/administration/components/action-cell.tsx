import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Importa o hook de tradução

import { ZoomInOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { Text } from "@/components";
import { Audit, AuditChange } from "@/graphql/schema.types";

export const ActionCell = ({ record }: { record: Audit }) => {
    const { t } = useTranslation(); // Obtém a função de tradução

    const [opened, setOpened] = useState(false);

    const columns: ColumnsType<AuditChange> = [
        {
            title: t("actionCell.field"), // Traduz o título do campo
            dataIndex: "field",
            key: "field",
            render: (value) => <Text strong>{value}</Text>,
            width: "20%",
        },
        {
            title: t("actionCell.newValue"), // Traduz o título do novo valor
            dataIndex: "to",
            key: "to",
        },
    ];

    if (record.action === "UPDATE") {
        columns.push({
            title: t("actionCell.oldValue"), // Traduz o título do valor antigo
            dataIndex: "from",
            key: "from",
        });
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    size="small"
                    icon={<ZoomInOutlined />}
                    onClick={() => setOpened((prev) => !prev)}
                >
                    {t("actionCell.details")} {/* Traduz o texto do botão */}
                </Button>
            </div>
            {opened && (
                <Modal
                    open={opened}
                    onOk={() => setOpened(false)}
                    onCancel={() => setOpened(false)}
                    style={{ minWidth: "60vw" }}
                    bodyStyle={{
                        maxHeight: "500px",
                        overflow: "auto",
                    }}
                >
                    <Table
                        dataSource={record.changes}
                        pagination={false}
                        rowKey="field"
                        bordered
                        size="small"
                        scroll={{ x: true }}
                        columns={columns}
                    />
                </Modal>
            )}
        </div>
    );
};

