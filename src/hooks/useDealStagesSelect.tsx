import { useSelect } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import gql from "graphql-tag";

import { useTranslation } from 'react-i18next'; // Import da biblioteca de internacionalização


import { DealStagesSelectQuery } from "@/graphql/types";

const DEAL_STAGES_SELECT_QUERY = gql`
    query DealStagesSelect(
        $filter: DealStageFilter!
        $sorting: [DealStageSort!]
        $paging: OffsetPaging!
    ) {
        dealStages(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                title
            }
        }
    }
`;

export const useDealStagesSelect = () => {
    const { t } = useTranslation(); // Import and use the useTranslation hook

    return useSelect<GetFieldsFromList<DealStagesSelectQuery>>({
        resource: t("dealStages"),
        meta: { gqlQuery: DEAL_STAGES_SELECT_QUERY },
    });
};
