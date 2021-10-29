import React from "react";
import { FiBell } from "react-icons/fi";
import SettingsItem from "../atoms/settings-item";

const ChatSettings = () => {
  return (
    <>
      <SettingsItem icon={<FiBell />} text={"Уведомления"} />
      <SettingsItem icon={<FiBell />} text={"Уведомления"} />
      <SettingsItem icon={<FiBell />} text={"Уведомления"} />
      <SettingsItem icon={<FiBell />} text={"Уведомления"} />
      <SettingsItem icon={<FiBell />} text={"Уведомления"} />
    </>
  );
};

export default ChatSettings;
