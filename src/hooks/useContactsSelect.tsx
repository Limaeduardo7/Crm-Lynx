import { useSelect } from "@refinedev/antd";
import { CrudFilters } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import gql from "graphql-tag";

import { useTranslation } from 'react-i18next'; // Import da biblioteca de internacionalização


import { ContactsSelectQuery } from "@/graphql/types";

const CONTACTS_SELECT_QUERY = gql`
    query ContactsSelect(
        $filter: ContactFilter!
        $sorting: [ContactSort!]
        $paging: OffsetPaging!
    ) {
        contacts(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                name
                avatarUrl
            }
        }
    }
`;

export const useContactsSelect = (params?: { filters?: CrudFilters }) => {
    const { t } = useTranslation(); // Import and use the useTranslation hook

    const { filters } = params || {};
    return useSelect<GetFieldsFromList<ContactsSelectQuery>>({
        resource: t("contacts"),
        optionLabel: "name",
        filters,
        meta: {
            gqlQuery: CONTACTS_SELECT_QUERY,
        },
    });
};
