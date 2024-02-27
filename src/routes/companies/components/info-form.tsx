import { useState } from "react";
import { useTranslation } from 'react-i18next'; // Importe o hook useTranslation

import { useShow } from "@refinedev/core";
import { GetFields } from "@refinedev/nestjs-query";

import {
    ApiOutlined,
    BankOutlined,
    ColumnWidthOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    ShopOutlined,
} from "@ant-design/icons";
import { Card, Input, InputNumber, Select, Space } from "antd";

import { SingleElementForm, Text } from "@/components";
import { BusinessType, CompanySize, Industry } from "@/graphql/schema.types";
import { CompanyInfoQuery } from "@/graphql/types";
import { currencyNumber } from "@/utilities";

import { COMPANY_INFO_QUERY } from "./queries";

type Company = GetFields<CompanyInfoQuery>;

export const CompanyInfoForm = () => {
    const { t } = useTranslation(); // Inicialize o hook useTranslation
    const [activeForm, setActiveForm] = useState<
        | "totalRevenue"
        | "industry"
        | "companySize"
        | "businessType"
        | "country"
        | "website"
    >();

    const { queryResult } = useShow<Company>({
        meta: {
            gqlQuery: COMPANY_INFO_QUERY,
        },
    });

    const data = queryResult?.data?.data;
    const {
        totalRevenue,
        industry,
        companySize,
        businessType,
        country,
        website,
    } = data || {};

    const getActiveForm = (args: { formName: keyof Company }) => {
        const { formName } = args;

        if (activeForm === formName) {
            return "form";
        }

        if (!data?.[formName]) {
            return "empty";
        }

        return "view";
    };

    const loading = queryResult?.isLoading;

    return (
        <Card
            title={
                <Space size={15}>
                    <ShopOutlined className="sm" />
                    {/* Utilize o método de tradução (t) para traduzir o texto "Company info" */}
                    <Text>{t('info.title')}</Text>
                </Space>
            }
            headStyle={{
                padding: "1rem",
            }}
            bodyStyle={{
                padding: "0",
            }}
            style={{
                maxWidth: "500px",
            }}
        >
            <SingleElementForm
                loading={loading}
                style={{
                    padding: "0.5rem 1rem",
                }}
                icon={<ColumnWidthOutlined className="tertiary" />}
                state={getActiveForm({ formName: "companySize" })}
                itemProps={{
                    name: "companySize",
                    label: t('info.companySize'), // Utilize o método de tradução (t) para traduzir o texto "Company size"
                }}
                view={<Text>{companySize}</Text>}
                onClick={() => setActiveForm("companySize")}
                onUpdate={() => setActiveForm(undefined)}
                onCancel={() => setActiveForm(undefined)}
            >
                <Select
                    autoFocus
                    defaultValue={companySize}
                    options={companySizeOptions}
                    style={{
                        width: "100%",
                    }}
                />
            </SingleElementForm>
            {/* Demais SingleElementForm com traduções apropriadas */}
        </Card>
    );
};

const companySizeOptions: {
    label: string;
    value: CompanySize;
}[] = [
    {
        label: "Enterprise",
        value: "ENTERPRISE",
    },
    {
        label: "Large",
        value: "LARGE",
    },
    {
        label: "Medium",
        value: "MEDIUM",
    },
    {
        label: "Small",
        value: "SMALL",
    },
];


const businessTypeOptions: {
    label: string;
    value: BusinessType;
}[] = [
    {
        label: "B2B",
        value: "B2B",
    },
    {
        label: "B2C",
        value: "B2C",
    },
    {
        label: "B2G",
        value: "B2G",
    },
];
