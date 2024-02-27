import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { NotificationsDealsQuery, NotificationsQuery } from "@/graphql/types";
import { Text } from "../text";
import { useTranslation } from "react-i18next";

type Props = {
    audit: GetFieldsFromList<NotificationsQuery>;
    deal?: GetFieldsFromList<NotificationsDealsQuery>;
};

export const NotificationMessage = ({ audit, deal }: Props) => {
    const { t } = useTranslation();

    if (!deal) return <Text>{t('notification_messages.loading')}</Text>;

    if (audit.action === "UPDATE") {
        return (
            <Text>
                <Text strong>{audit.user?.name}</Text>
                {` ${t('notification_messages.moved')} `}
                <Text strong>{deal.title}</Text>
                {` ${t('notification_messages.deal_to')} `}
                <Text strong>{deal.stage?.title || t('notification_messages.unassigned')}</Text>.
            </Text>
        );
    } else if (audit.action === "CREATE") {
        return (
            <Text>
                <Text strong>{audit.user?.name}</Text>
                {` ${t('notification_messages.created')} `}
                <Text strong>{deal.title}</Text>
                {` ${t('notification_messages.deal_in')} `}
                <Text strong>{deal.stage?.title || t('notification_messages.unassigned')}</Text>.
            </Text>
        );
    }

    return <Text>{t('notification_messages.unknown_action')}</Text>;
};
