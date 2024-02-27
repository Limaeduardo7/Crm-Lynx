import { useTranslation } from 'react-i18next'; // Import da biblioteca de internacionalização

import { useSelect } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import gql from "graphql-tag";

import { CompaniesSelectQuery } from "@/graphql/types";

const COMPANIES_SELECT_QUERY = gql`
    query CompaniesSelect(
        $filter: CompanyFilter!
        $sorting: [CompanySort!]
        $paging: OffsetPaging!
    ) {
        companies(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                name
                avatarUrl
            }
        }
    }
`;

export const useCompaniesSelect = () => {
    const { t } = useTranslation(); // Import and use the useTranslation hook

    return useSelect<GetFieldsFromList<CompaniesSelectQuery>>({
        resource: t("companies"), // Translate resource string
        optionLabel: "name",
        meta: {
            gqlQuery: COMPANIES_SELECT_QUERY,
        },
    });
};
