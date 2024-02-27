import React, { useContext } from 'react';
import { useGetLocale, useSetLocale } from "@refinedev/core";
import { DownOutlined } from "@ant-design/icons";
import { Layout as AntdLayout, Space, Button, Dropdown, Avatar, Menu } from "antd";
import { useTranslation } from "react-i18next";

import { searchClient } from "@/providers";

import { AlgoliaSearch } from "./algolia-search";
import { CurrentUser } from "./current-user";
import { Notifications } from "./notifications";

const simpleLangToCountryMap: Record<string, string> = {
  "ja": "jp",
  "en": "us",
  "fr": "fr",
  "de": "de",
  "it": "it",
  "es": "es",
  "ru": "ru",
  "zh": "cn",
  "ar": "sa",
  "pt": "br",
  "hi": "in"
};

export const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const currentLocale = locale() || "";


  const headerStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: !!searchClient ? "space-between" : "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "sticky",
    top: 0,
    zIndex: 999,
};

  const menu = (
    <Menu selectedKeys={[currentLocale]} onClick={({ key }) => changeLanguage(key)}>
      <Menu.Item key="en">
        <Space>
          <Avatar size={16} src={`/images/flags/en.svg`} />
          En
        </Space>
      </Menu.Item>
      <Menu.Item key="pt">
        <Space>
          <Avatar size={16} src={`/images/flags/pt.svg`} />
          Pt
        </Space>
      </Menu.Item>
      <Menu.Item key="es">
        <Space>
          <Avatar size={16} src={`/images/flags/es.svg`} />
          Es
        </Space>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntdLayout.Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0px 24px",
        height: "48px",
        backgroundColor: "white",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}

    > {!!searchClient ? <AlgoliaSearch /> : null}
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="text">
          <Space align="center" size="middle">
            <Avatar
              size={16}
              src={`/images/flags/pt.svg`}             />
            {currentLocale}
            <DownOutlined />
          </Space>
        </Button>
        </Dropdown>
      <div style={{ marginLeft: '5px' }}> {/* Adiciona margem entre os componentes */}
        <Notifications />
      </div>
      <div style={{ marginLeft: '20px' }}> {/* Adiciona margem entre os componentes */}
        <CurrentUser />
      </div>
    </AntdLayout.Header>
  );
};