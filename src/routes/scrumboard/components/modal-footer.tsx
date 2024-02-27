import { DeleteButton } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { useTranslation } from "react-i18next";

export const ModalFooter = () => {
    const { list } = useNavigation();
    const { t } = useTranslation();

    return (
        <DeleteButton
            type="link"
            onSuccess={() => {
                list("tasks", "replace");
            }}
        >
            {t("modalFooter.deleteCard")}
        </DeleteButton>
    );
};
