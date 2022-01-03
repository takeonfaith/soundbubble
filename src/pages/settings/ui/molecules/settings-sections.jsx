import React from "react";
import styled from "styled-components";
import SettingsSectionItem from "../atoms/settings-section-item";
import { BiMusic } from "react-icons/bi";
import { FiMessageCircle, FiUser } from "react-icons/fi";

const SettingsSectionsWrapper = styled.div`
  width: 15%;
  border-radius: 5px;
  overflow: hidden;
  background: var(--leftSideBarColor);
`;

const SettingsSections = ({ currentPage, setCurrentPage }) => {
  return (
    <SettingsSectionsWrapper>
      <SettingsSectionItem
        icon={<FiUser />}
        text={"Account"}
        onClick={() => setCurrentPage(0)}
        isActive={currentPage === 0}
      />
      <SettingsSectionItem
        icon={<BiMusic />}
        text={"Music"}
        onClick={() => setCurrentPage(1)}
        isActive={currentPage === 1}
      />
      <SettingsSectionItem
        icon={<FiMessageCircle />}
        text={"Chat"}
        onClick={() => setCurrentPage(2)}
        isActive={currentPage === 2}
      />
      <SettingsSectionItem
        icon={<BiMusic />}
        text={"Music"}
        onClick={() => setCurrentPage(3)}
        isActive={currentPage === 3}
      />
    </SettingsSectionsWrapper>
  );
};

export default SettingsSections;
