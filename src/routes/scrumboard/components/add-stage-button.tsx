import { FC, PropsWithChildren } from "react";
import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import { Text } from "@/components";
import { useTranslation } from "react-i18next"; // Importe a função useTranslation

type Props = ButtonProps;

export const KanbanAddStageButton: FC<PropsWithChildren<Props>> = ({
    children,
    onClick,
    style,
    ...rest
}) => {
    const { t } = useTranslation(); // Obtendo a função de tradução

    return (
        <Button
            type="dashed"
            size="large"
            icon={<PlusSquareOutlined className="secondary md" />}
            style={{
                marginTop: "16px",
                marginLeft: "16px",
                marginRight: "16px",
                height: "56px",
                ...style,
            }}
            onClick={onClick}
            {...rest}
        >
            {children ?? (
                <Text size="md" type="secondary">
                    {t("KanbanAddStageButton.addStage")}
                </Text>
            )}
        </Button>
    );
};
