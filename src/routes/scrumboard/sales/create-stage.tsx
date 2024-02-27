import { useModalForm } from "@refinedev/antd";
import { useInvalidate, useNavigation } from "@refinedev/core";
import { useTranslation } from "react-i18next";

import { Form, Input, Modal } from "antd";  

import { SALES_CREATE_DEAL_STAGE_MUTATION } from "./queries";

export const SalesCreateStage = () => {
  const { t } = useTranslation();

  const invalidate = useInvalidate();
  const { list } = useNavigation();
  const { formProps, modalProps, close } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "dealStages",
    meta: {
      gqlMutation: SALES_CREATE_DEAL_STAGE_MUTATION,
    },
    onMutationSuccess: () => {
      invalidate({ invalidates: ["list"], resource: "deals" });
    },
    successNotification: () => {
      return {
        key: "create-stage",
        type: "success",
        message: t("salesCreateStage.successMessage"),
        description: t("salesCreateStage.successDescription"),
      };
    },
  });

  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list(t("salesCreateStage.backToList"));
      }}
      title={t("salesCreateStage.addNewStage")}
      width={512}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={t("salesCreateStage.title")}
          name="title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};