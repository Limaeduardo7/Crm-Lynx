import React from "react";
import { useList } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, Skeleton as AntdSkeleton } from "antd";
import dayjs from "dayjs";
import { CustomAvatar, Text } from "@/components";
import {
    LatestActivitiesAuditsQuery,
    LatestActivitiesDealsQuery,
} from "@/graphql/types";
import styles from "./index.module.css";
import { AUDITS_QUERY, DEALS_QUERY } from "./queries";
import { useTranslation } from "react-i18next"; // Importação do hook useTranslation

export const DashboardLatestActivities: React.FC<{ limit?: number }> = ({
    limit = 5,
}) => {
    const { t } = useTranslation(); // Uso do hook useTranslation
    const { data: deals, isLoading: isLoadingDeals } = useList<
        GetFieldsFromList<LatestActivitiesDealsQuery>
    >({
        resource: "deals",
        pagination: {
            mode: "off",
        },
        meta: {
            gqlQuery: DEALS_QUERY,
        },
    });
    const {
        data: audit,
        isLoading: isLoadingAudit,
        isError,
        error,
    } = useList<GetFieldsFromList<LatestActivitiesAuditsQuery>>({
        resource: "audits",
        pagination: {
            pageSize: limit,
        },
        sorters: [
            {
                field: "createdAt",
                order: "desc",
            },
        ],
        filters: [
            {
                field: "action",
                operator: "in",
                value: ["CREATE", "UPDATE"],
            },
            {
                field: "targetEntity",
                operator: "eq",
                value: "Deal",
            },
        ],
        meta: {
            gqlQuery: AUDITS_QUERY,
        },
    });

    if (isError) {
        console.error("Erro ao buscar últimas atividades", error);
        return null;
    }

    const isLoading = isLoadingAudit || isLoadingDeals;

    return (
        <Card
            headStyle={{ padding: "16px" }}
            bodyStyle={{ padding: "0 1rem" }}
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <UnorderedListOutlined />
                    <Text size="sm" style={{ marginLeft: ".5rem" }}>
                        {t('dashboardLatestActivities.latestActivities')} {/* Utilização da tradução */}
                    </Text>
                </div>
            }
        >
            {isLoading &&
                Array.from({ length: limit }).map((_, index) => (
                    <Skeleton key={index} />
                ))}
            {!isLoading &&
                audit?.data.map(({ id, user, createdAt, action, targetId }) => {
                    const deal =
                        deals?.data.find((task) => task.id === `${targetId}`) ||
                        undefined;

                    return (
                        <div key={id} className={styles.item}>
                            <div className={styles.avatar}>
                                <CustomAvatar
                                    shape="square"
                                    size={48}
                                    src={deal?.company.avatarUrl}
                                    name={deal?.company.name}
                                />
                            </div>
                            <div className={styles.action}>
                                <Text type="secondary" size="xs">
                                    {dayjs(createdAt).fromNow()}
                                </Text>

                                <Text className={styles.detail}>
                                    <Text className={styles.name} strong>
                                        {user?.name}
                                    </Text>
                                    <Text>
                                        {action === "CREATE"
                                            ? t('dashboardLatestActivities.created') // Utilização da tradução
                                            : t('dashboardLatestActivities.moved')} {/* Utilização da tradução */}
                                    </Text>
                                    <Text strong>{deal?.title}</Text>
                                    <Text>{t('dashboardLatestActivities.deal')}</Text> {/* Utilização da tradução */}
                                    <Text>
                                        {action === "CREATE" ? t('dashboardLatestActivities.in') : t('dashboardLatestActivities.to')} {/* Utilização da tradução */}
                                    </Text>
                                    <Text strong>
                                        {deal?.stage?.title || t('dashboardLatestActivities.unassigned')}. {/* Utilização da tradução */}
                                    </Text>
                                </Text>
                            </div>
                        </div>
                    );
                })}
        </Card>
    );
};

const Skeleton = () => {
    return (
        <div className={styles.item}>
            <AntdSkeleton.Avatar
                active
                size={48}
                shape="square"
                style={{
                    borderRadius: "4px",
                    marginRight: "16px",
                }}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <AntdSkeleton.Button
                    active
                    style={{
                        height: "16px",
                    }}
                />
                <AntdSkeleton.Button
                    active
                    style={{
                        width: "300px",
                        height: "16px",
                    }}
                />
            </div>
        </div>
    );
};
