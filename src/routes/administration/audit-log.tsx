import {
    DateField,
    FilterDropdown,
    getDefaultSortOrder,
    List,
    useTable,
} from "@refinedev/antd";
import { getDefaultFilter } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Radio, Space, Table, Tag, TagProps } from "antd";

import { CustomAvatar, PaginationTotal, Text } from "@/components";
import { Audit } from "@/graphql/schema.types";
import { AdministrationAuditLogsQuery } from "@/graphql/types";

import { useTranslation } from 'react-i18next'; // Importa o hook de tradução


import { ActionCell } from "./components";
import { ADMINISTRATION_AUDIT_LOGS_QUERY } from "./queries";

const getActionColor = (action: string): TagProps["color"] => {
    switch (action) {
        case "CREATE":
            return "green";
        case "UPDATE":
            return "cyan";
        case "DELETE":
            return "red";
        default:
            return "default";
    }
};

export const AuditLogPage = () => {
    const { t } = useTranslation(); // Obtém a função de tradução

    const { tableProps, filters, sorters } = useTable<
        GetFieldsFromList<AdministrationAuditLogsQuery>
    >({
        meta: {
            gqlQuery: ADMINISTRATION_AUDIT_LOGS_QUERY,
        },
        filters: {
            initial: [
                { field: "user.name", value: "", operator: "contains" },
                { field: "createdAt", value: [], operator: "between" },
            ],
        },
        sorters: {
            initial: [{ field: "createdAt", order: "desc" }],
        },
    });

    return (
        <div className="page-container">
            <List
                breadcrumb={false}
                contentProps={{ style: { marginTop: "1.6rem" } }}
                title={
                    <Text
                        style={{
                            fontWeight: "500",
                            fontSize: "24px",
                            lineHeight: "24px",
                        }}
                    >
                        <Text>{t('auditLogPage.title')}</Text>
                    </Text>
                }
            >
                <Table
                    className="audit-log-table"
                    {...tableProps}
                    rowKey="id"
                    scroll={{ x: true }}
                    pagination={{
                        ...tableProps.pagination,
                        showTotal: (total) => (
                            <PaginationTotal
                                total={total}
                                entityName={t('pagination.showTotal', { total: total })}
                            />
                        ),
                    }}
                >
                    <Table.Column
                        dataIndex="user.name"
                        title={t('tableColumns.user')}
                        width="15%"
                        filterIcon={<SearchOutlined />}
                        render={(_, record: Audit) => {
                            return (
                                <Space>
                                    <CustomAvatar
                                        src={record.user?.avatarUrl}
                                        name={record.user?.name}
                                    />
                                    {record.user?.name || "N/A"}
                                </Space>
                            );
                        }}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Input />
                            </FilterDropdown>
                        )}
                        defaultFilteredValue={getDefaultFilter(
                            "user.name",
                            filters,
                            "contains",
                        )}
                    />
                    <Table.Column
                        dataIndex="action"
                        title={t('tableColumns.action')}
                        render={(_, record: Audit) => {
                            return (
                                <Space>
                                    <Tag color={getActionColor(record.action)}>
                                        {record.action.charAt(0) +
                                            record.action
                                                .slice(1)
                                                .toLowerCase()}
                                    </Tag>
                                </Space>
                            );
                        }}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Radio.Group>
                                    <Radio value="CREATE">{t('filters.created')}</Radio>
                                    <Radio value="UPDATE">{t('filters.updated')}</Radio>
                                    <Radio value="DELETE">{t('filters.deleted')}</Radio>
                                </Radio.Group>
                            </FilterDropdown>
                        )}
                        defaultFilteredValue={getDefaultFilter(
                            "action",
                            filters,
                            "eq",
                        )}
                    />
                    <Table.Column dataIndex="targetEntity" title={t('tableColumns.entity')} />
                    <Table.Column dataIndex="targetId" title={t('tableColumns.entityId')} />
                    <Table.Column
                        dataIndex="changes"
                        title={t('tableColumns.changes')}
                        render={(_, record: Audit) => (
                            <ActionCell record={record} />
                        )}
                    />
                    <Table.Column
                        dataIndex="createdAt"
                        title={t('tableColumns.dateTime')}
                        width="15%"
                        render={(value) => (
                            <DateField
                                style={{ verticalAlign: "middle" }}
                                value={value}
                                format="MM.DD.YYYY - hh:mm"
                            />
                        )}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <DatePicker.RangePicker />
                            </FilterDropdown>
                        )}
                        sorter
                        defaultFilteredValue={getDefaultFilter(
                            "createdAt",
                            filters,
                            "between",
                        )}
                        defaultSortOrder={getDefaultSortOrder(
                            "createdAt",
                            sorters,
                        )}
                    />
                </Table>
            </List>
        </div>
    );
};
