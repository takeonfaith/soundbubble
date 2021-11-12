import React, { useState } from "react";
import styled from "styled-components";
import { ContentContainer } from "../../shared/ui/atoms/content-container";
import SettingsList from "./ui/molecules/settings-list";
import SettingsSections from "./ui/molecules/settings-sections";

const SettingsPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const SettingsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <ContentContainer>
      <h2>Settings</h2>
      <SettingsPageWrapper>
        <SettingsSections
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
        <SettingsList currentPage={currentPage} />
      </SettingsPageWrapper>
    </ContentContainer>
  );
};

export default SettingsPage;
