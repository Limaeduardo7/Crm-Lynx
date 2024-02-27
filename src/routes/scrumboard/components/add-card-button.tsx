import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next"; // Importe a função useTranslation
import { PlusSquareOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Text } from "@/components";

interface Props {
    onClick: () => void;
}

export const KanbanAddCardButton: FC<PropsWithChildren<Props>> = ({
    children,
    onClick,
}) => {
    const { t } = useTranslation(); // Use a função useTranslation para obter as traduções

    return (
        <Button
            size="large"
            icon={<PlusSquareOutlined className="md" />}
            style={{
                margin: "16px",
                backgroundColor: "white",
            }}
            onClick={onClick}
        >
            {children ?? (
                <Text size="md" type="secondary">
                    {t("KanbanAddCardButton.addNewCard")}
                </Text>
            )}
        </Button>
    );
};
