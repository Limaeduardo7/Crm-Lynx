import { GetFields } from "@refinedev/nestjs-query";
import { Space, Typography } from "antd";
import { useTranslation } from "react-i18next"; // Importando o hook useTranslation
import { UserTag } from "@/components";
import { KanbanGetTaskQuery } from "@/graphql/types";

type Props = {
    users?: GetFields<KanbanGetTaskQuery>["users"];
};

export const UsersHeader = ({ users = [] }: Props) => {
    const { t } = useTranslation(); // Usando o hook useTranslation

    if (users.length > 0) {
        return (
            <Space size={[0, 8]} wrap>
                {users.map((user) => (
                    <UserTag key={user.id} user={user} />
                ))}
            </Space>
        );
    }

    return <Typography.Link>{t("UsersHeader.assignToUsers")}</Typography.Link>;
};
