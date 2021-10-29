import React from "react";
import styled from "styled-components";
import AccountSettings from "../orgamisms/account-settings";
import ChatSettings from "../orgamisms/chat-settings";
import MusicSettings from "../orgamisms/music-settings";

const SettingsListWrapper = styled.div`
  width: 85%;
  height: 100px;
  border-radius: 5px;
`;

const SettingsList = ({ currentPage }) => {
  const settingsPages = [
    <AccountSettings />,
    <MusicSettings />,
    <ChatSettings />,
  ];
  return (
    <SettingsListWrapper>{settingsPages[currentPage]}</SettingsListWrapper>
  );
};

export default SettingsList;
