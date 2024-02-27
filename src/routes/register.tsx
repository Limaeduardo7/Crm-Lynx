import React from "react";
import { useTranslation } from "react-i18next"; // Importa o hook de tradução

import { AuthPage } from "@refinedev/antd";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";

import { Title } from "@/components";

export const RegisterPage: React.FC = () => {
    const { t } = useTranslation(); // Obtém a função de tradução

    return (
        <AuthPage
            type="register"
            title={<Title collapsed={false} />}
            providers={[
                {
                    name: "google",
                    label: t("registerPage.signInGoogle"),
                    icon: (
                        <GoogleOutlined
                            style={{
                                fontSize: 24,
                                lineHeight: 0,
                            }}
                        />
                    ),
                },
                {
                    name: "github",
                    label: t("registerPage.signInGitHub"),
                    icon: (
                        <GithubOutlined
                            style={{
                                fontSize: 24,
                                lineHeight: 0,
                            }}
                        />
                    ),
                },
            ]}
        />
    );
};
