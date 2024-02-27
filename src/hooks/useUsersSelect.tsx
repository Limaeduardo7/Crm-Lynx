import { useSelect } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import gql from "graphql-tag";

import { useTranslation } from 'react-i18next'; // Import da biblioteca de internacionalização


import { UsersSelectQuery } from "@/graphql/types";

const USERS_SELECT_QUERY = gql`
    query UsersSelect(
        $filter: UserFilter!
        $sorting: [UserSort!]
        $paging: OffsetPaging!
    ) {
        users(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                name
                avatarUrl
            }
        }
    }
`;

export const useUsersSelect = () => {
    const { t } = useTranslation(); // Import and use the useTranslation hook

    return useSelect<GetFieldsFromList<UsersSelectQuery>>({
        resource: t("users"),
        optionLabel: "name",
        meta: {
            gqlQuery: USERS_SELECT_QUERY,
        },
    });
};
