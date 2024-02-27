import React from "react";
import { FilterDropdown, useTable } from "@refinedev/antd";
import { getDefaultFilter } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
    EnvironmentOutlined,
    GlobalOutlined,
    MailOutlined,
    PhoneOutlined,
    SearchOutlined,
    ShopOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Card, Col, Input, Row, Select, Space, Table } from "antd";
import cn from "classnames";

import { CustomAvatar, Logo, Text } from "@/components";
import { User } from "@/graphql/schema.types";
import { AdministrationUsersQuery } from "@/graphql/types";

import { RoleTag } from "./components";
import { ADMINISTRATION_USERS_QUERY } from "./queries";
import styles from "./settings.module.css";
import { useTranslation } from "react-i18next";

export const SettingsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="page-container">
            <Space
                size={16}
                style={{
                    width: "100%",
                    paddingBottom: "24px",
                    borderBottom: "1px solid #D9D9D9",
                }}
            >
                
                <Logo width={96} height={96} />
                <Text style={{ fontSize: "32px", fontWeight: 700 }}>
                    Lynx Analytics
                </Text>
            </Space>
            <Row
                gutter={[32, 32]}
                style={{
                    marginTop: 32,
                }}
            >
                <Col
                    xs={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 24 }}
                    xl={{ span: 16 }}
                >
                    <UsersTable />
                </Col>
                <Col
                    xs={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 24 }}
                    xl={{ span: 8 }}
                >
                    <CompanyInfo />
                </Col>
            </Row>
        </div>
    );
};

const UsersTable = () => {
    const { t } = useTranslation();
    const roleOptions = [
        {
            label: t('roles.admin.title'), 
            value: "ADMIN",
        },
        {
            label: t('roles.salesIntern.title'),
            value: "SALES_INTERN",
        },
        {
            label: t('roles.salesPerson.title'),
            value: "SALES_PERSON",
        },
        {
            label: t('roles.salesManager.title'),
            value: "SALES_MANAGER",
        },
    ];

    const { tableProps, filters } = useTable<
        GetFieldsFromList<AdministrationUsersQuery>
    >({
        resource: "users",
        sorters: {
            initial: [
                {
                    field: "createdAt",
                    order: "desc",
                },
            ],
        },
        filters: {
            initial: [
                {
                    field: "jobTitle",
                    value: "",
                    operator: "contains",
                },
                {
                    field: "name",
                    value: "",
                    operator: "contains",
                },
                {
                    field: "status",
                    value: undefined,
                    operator: "in",
                },
            ],
        },
        meta: {
            gqlQuery: ADMINISTRATION_USERS_QUERY,
        },
    });

    return (
        <Card
            bodyStyle={{ padding: 0 }}
            headStyle={{
                borderBottom: "1px solid #D9D9D9",
                marginBottom: "1px",
            }}
            title={
                <Space size="middle">
                    <TeamOutlined />
                    <Text>{t("contacts.title")}</Text>
                </Space>
            }
            extra={
                <>
                    <Text className="tertiary">{t("totalUsers.title")}:</Text>
                    <Text strong>
                        {tableProps?.pagination !== false &&
                            tableProps.pagination?.total}
                    </Text>
                </>
            }
        >
            <Table {...tableProps}>
                <Table.Column<User>
                    dataIndex="name"
                    title={t("name.title")}
                    defaultFilteredValue={getDefaultFilter(
                        "name",
                        filters,
                        "contains",
                    )}
                    filterIcon={<SearchOutlined />}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input placeholder={t("searchName.title")} />
                        </FilterDropdown>
                    )}
                    render={(_, record) => {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <CustomAvatar
                                    src={record.avatarUrl}
                                    name={record.name}
                                />
                                <Text>{record.name}</Text>
                            </div>
                        );
                    }}
                />
                <Table.Column
                    dataIndex="jobTitle"
                    title={t("title.title")}
                    defaultFilteredValue={getDefaultFilter(
                        "jobTitle",
                        filters,
                        "contains",
                    )}
                    filterIcon={<SearchOutlined />}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input placeholder={t("searchTitle.title")} />
                        </FilterDropdown>
                    )}
                />
                <Table.Column<User>
                    dataIndex="role"
                    title={t("role.title")}
                    defaultFilteredValue={getDefaultFilter(
                        "role",
                        filters,
                        "in",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Select
                                style={{ width: "200px" }}
                                mode="multiple"
                                placeholder={t("selectRole.title")}
                                options={roleOptions}
                            />
                        </FilterDropdown>
                    )}
                    render={(_, record) => {
                        return <RoleTag role={record.role} />;
                    }}
                />
            </Table>
        </Card>
    );
};

const CompanyInfo = () => {
    const { t } = useTranslation();
    const companyInfo = [
        {
            label: t("address.title"),
            value: "Caxias do Sul, RS",
            icon: <EnvironmentOutlined className="tertiary" />,
        },
        {
            label: t("phone.title"),
            value: "+54991309429",
            icon: <PhoneOutlined className="tertiary" />,
        },
        {
            label: t("email.title"),
            value: "info@lynxanalytics.com",
            icon: <MailOutlined className="tertiary" />,
        },
        {
            label: t("website.title"),
            value: "https://lynxanalytics.com",
            icon: <GlobalOutlined className="tertiary" />,
        },
    ];

    return (
        <Card
            title={
                <Space>
                    <ShopOutlined />
                    <Text>{t("companyInfo.title")}</Text>
                </Space>
            }
            headStyle={{
                padding: "1rem",
            }}
            bodyStyle={{
                padding: "0",
            }}
        >
            <div className={styles.list}>
                {companyInfo.map((item) => {
                    return (
                        <div key={item.label} className={styles.listItem}>
                            <div>{item.icon}</div>
                            <div className={styles.listItemContent}>
                                <Text size="xs" className="tertiary">
                                    {item.label}
                                </Text>
                                <Text
                                    className={cn(
                                        styles.listItemContent,
                                        "primary",
                                    )}
                                >
                                    {item.value}
                                </Text>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default SettingsPage;
