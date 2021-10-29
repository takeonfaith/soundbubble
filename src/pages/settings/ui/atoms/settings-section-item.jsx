import styled from "styled-components";

const SettingsSectionItemWrapper = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  /* transition: 0.1s; */
  padding: 10px;
  box-sizing: border-box;
  background: ${({ isActive }) =>
    isActive ? "var(--lightBlue)" : "transparent"};
  color: #fff;
  font-weight: 600;

  svg {
    margin-right: 7px;
    width: 16px;
    height: 16px;
  }
  /* 
  &:hover {
    background: var(--leftSideBarColor);
  } */
`;

const SettingsSectionItem = ({ icon, text, onClick, isActive }) => {
  return (
    <SettingsSectionItemWrapper onClick={onClick} isActive={isActive}>
      {icon}
      {text}
    </SettingsSectionItemWrapper>
  );
};

export default SettingsSectionItem;
