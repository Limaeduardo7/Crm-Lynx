import { Space, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next'; // Importar o hook de tradução

import { Text } from "@/components";
import { Task } from "@/graphql/schema.types";
import { getDateColor } from "@/utilities";

type Props = {
    dueData?: Task["dueDate"];
};

export const DueDateHeader = ({ dueData }: Props) => {
    const { t } = useTranslation(); // Hook para obter as traduções

    if (dueData) {
        const color = getDateColor({
            date: dueData,
            defaultColor: "processing",
        });
        const getTagText = () => {
            switch (color) {
                case "error":
                    return t('DueDateHeader.overdue');
                case "warning":
                    return t('DueDateHeader.dueSoon');
                default:
                    return t('DueDateHeader.processing');
            }
        };

        return (
            <Space size={[0, 8]}>
                <Tag color={color}>{getTagText()}</Tag>
                <Text>{dayjs(dueData).format("MMMM D, YYYY - h:ma")}</Text>
            </Space>
        );
    }

    return <Typography.Link>{t('DueDateHeader.addDueDate')}</Typography.Link>;
};
