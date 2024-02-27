import { MarkdownField } from "@refinedev/antd";
import { Typography } from "antd";
import { useTranslation } from "react-i18next"; // Importação do hook useTranslation

import { Task } from "@/graphql/schema.types";

type Props = {
    description?: Task["description"];
};

export const DescriptionHeader = ({ description }: Props) => {
    const { t } = useTranslation(); // Uso do hook useTranslation

    if (description) {
        return (
            <Typography.Paragraph ellipsis={{ rows: 8 }}>
                <MarkdownField value={description} />
            </Typography.Paragraph>
        );
    }

    return <Typography.Link>{t('DescriptionHeader.addTaskDescription')}</Typography.Link>;
};
