import React from "react";
import { useTranslation } from 'react-i18next';
import { Menu, Dropdown } from 'antd';

import { useUpdate } from "@refinedev/core";
import { GetFields } from "@refinedev/nestjs-query";

import {
    CheckCircleFilled,
    DownOutlined,
    MinusCircleFilled,
    PlayCircleFilled,
    PlayCircleOutlined,
} from "@ant-design/icons";

import { Text } from "@/components";
import { ContactStageEnum, ContactStatusEnum } from "@/enums";
import { ContactStatus as ContactStatusType } from "@/graphql/schema.types";
import { ContactShowQuery } from "@/graphql/types";

import styles from "./index.module.css";

type ContactStatusProps = {
    contact: GetFields<ContactShowQuery>;
};

const statusToStage = (status: ContactStatusEnum): ContactStageEnum => {
    let stage: ContactStageEnum = ContactStageEnum.CUSTOMER;
    switch (status) {
        case ContactStatusEnum.NEW:
        case ContactStatusEnum.CONTACTED:
        case ContactStatusEnum.INTERESTED:
            stage = ContactStageEnum.LEAD;
            break;
        case ContactStatusEnum.QUALIFIED:
        case ContactStatusEnum.NEGOTIATION:
            stage = ContactStageEnum.SALES_QUALIFIED_LEAD;
            break;
        case ContactStatusEnum.UNQUALIFIED:
            stage = ContactStageEnum.LEAD;
            break;
        case ContactStatusEnum.LOST:
            stage = ContactStageEnum.SALES_QUALIFIED_LEAD;
            break;
        case ContactStatusEnum.WON:
            stage = ContactStageEnum.CUSTOMER;
            break;
        case ContactStatusEnum.CHURNED:
            stage = ContactStageEnum.CUSTOMER;
            break;
        default:
            break;
    }
    return stage;
};

const LifecycleStage: React.FC<{ status: ContactStatusType }> = ({
    status,
}) => {
    const { t } = useTranslation();
    const stage = statusToStage(status as ContactStatusEnum);
    let icon = <PlayCircleOutlined style={{ color: "#08979C" }} />;

    switch (status) {
        case ContactStatusEnum.WON:
            icon = <CheckCircleFilled style={{ color: "#389E0D" }} />;
            break;
        case ContactStatusEnum.CHURNED:
            icon = <MinusCircleFilled style={{ color: "#CF1322" }} />;
            break;
        case ContactStatusEnum.LOST:
            icon = <PlayCircleFilled style={{ color: "#CF1322" }} />;
            break;
        case ContactStatusEnum.UNQUALIFIED:
            icon = <PlayCircleOutlined style={{ color: "#CF1322" }} />;
            break;
        default:
            break;
    }

    return (
        <Text strong>
            {t('lifecycleStage.title')} {icon}
            <Text
                style={{
                    marginLeft: ".2rem",
                    textTransform: "capitalize",
                    fontWeight: "normal",
                }}
            >
            </Text>
        </Text>
    );
};

export const ContactStatus: React.FC<ContactStatusProps> = ({ contact }) => {
    const { t } = useTranslation();
    const { mutate } = useUpdate();
    const { status } = contact;

    const updateStatus = (status: ContactStatusEnum) => {
        const stage = statusToStage(status);
        mutate({
            resource: "contacts",
            mutationMode: "optimistic",
            id: contact.id,
            values: {
                status,
                stage,
            },
        });
    };

    return (
        <div>
            <LifecycleStage status={status} />
            <ul
                className={`${styles.container} ${styles[status]}`}
                style={{ marginTop: "1rem" }}
            >
                <li
                    className={`${styles.item} ${
                        status === ContactStatusEnum.NEW ? styles.active : ""
                    }`}
                >
                    <a
                        onClick={() => {
                            updateStatus(ContactStatusEnum.NEW);
                        }}
                    >
                        {t(`contactStatus.new`)}
                    </a>
                </li>
                <li
                    className={`${styles.item} ${
                        status === ContactStatusEnum.CONTACTED
                            ? styles.active
                            : ""
                    }`}
                >
                    <a
                        onClick={() => {
                            updateStatus(ContactStatusEnum.CONTACTED);
                        }}
                    >
                        {t(`contactStatus.contacted`)}
                    </a>
                </li>
                <li
                    className={`${styles.item} ${
                        status === ContactStatusEnum.INTERESTED ||
                        status === ContactStatusEnum.UNQUALIFIED
                            ? styles.active
                            : ""
                    }`}
                >
                    <Dropdown
                        arrow
                        trigger={["click"]}
                        placement="bottomRight"
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={() => {
                                        updateStatus(
                                            ContactStatusEnum.INTERESTED
                                        );
                                    }}
                                >
                                    {t(`dropdownLabels.interested`)}
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        updateStatus(
                                            ContactStatusEnum.UNQUALIFIED
                                        );
                                    }}
                                >
                                    {t(`dropdownLabels.unqualified`)}
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <a>
                            {status === ContactStatusEnum.UNQUALIFIED
                                ? t(`contactStatus.unqualified`)
                                : t(`contactStatus.interested`)}
                            <DownOutlined className={styles.arrow} />
                        </a>
                    </Dropdown>
                </li>
                <li
                    className={`${styles.item} ${
                        status === ContactStatusEnum.QUALIFIED
                            ? styles.active
                            : ""
                    }`}
                >
                    <a
                        onClick={() => {
                            updateStatus(ContactStatusEnum.QUALIFIED);
                        }}
                    >
                        {t(`contactStatus.qualified`)}
                    </a>
                </li>
                <li
                    className={`${styles.item} ${
                        status === ContactStatusEnum.NEGOTIATION ||
                        status === ContactStatusEnum.LOST
                            ? styles.active
                            : ""
                    }`}
                >
                    <Dropdown
                        arrow
                        trigger={["click"]}
                        placement="bottomRight"
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={() => {
                                        updateStatus(
                                            ContactStatusEnum.NEGOTIATION
                                        );
                                    }}
                                >
                                    {t(`dropdownLabels.negotiation`)}
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        updateStatus(ContactStatusEnum.LOST);
                                    }}
                                >
                                    {t(`dropdownLabels.lost`)}
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <a>
                            {status === ContactStatusEnum.LOST
                                ? t(`contactStatus.lost`)
                                : t(`contactStatus.negotiation`)}
                            <DownOutlined className={styles.arrow} />
                        </a>
                    </Dropdown>
                </li>
                <li
                    className={`${styles.item} ${
                        status === ContactStatusEnum.WON ||
                        status === ContactStatusEnum.CHURNED
                            ? styles.active
                            : ""
                    }`}
                >
                    <Dropdown
                        arrow
                        trigger={["click"]}
                        placement="bottomRight"
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={() => {
                                        updateStatus(ContactStatusEnum.WON);
                                    }}
                                >
                                    {t(`dropdownLabels.won`)}
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        updateStatus(ContactStatusEnum.CHURNED);
                                    }}
                                >
                                    {t(`dropdownLabels.churned`)}
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <a>
                            {status === ContactStatusEnum.CHURNED
                                ? t(`contactStatus.churned`)
                                : t(`contactStatus.won`)}
                            <DownOutlined className={styles.arrow} />
                        </a>
                    </Dropdown>
                </li>
            </ul>
        </div>
    );
};
