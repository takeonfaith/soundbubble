import { useState } from "react";
import styled from "styled-components";
import { SwitchToggle } from "../molecules/switch-toggle";

const SettingsItemWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
  padding: 20px 50px;
  box-sizing: border-box;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0%;
    /* transform: translateX(-50%); */
    background: #313131;
  }

  .icon-and-text {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    user-select: none;

    svg {
      margin-right: 7px;
      width: 20px;
      height: 20px;
    }
  }

  &:hover {
    background: var(--leftSideBarColor);
  }
`;

const SettingsItem = ({ icon, text, action }) => {
  const [boolValue, setBoolValue] = useState(false);

  const handleChangeToggle = (val) => {
    setBoolValue(val);
    if (val && !!action) action();
  };

  return (
    <SettingsItemWrapper onClick={() => handleChangeToggle(!boolValue)}>
      <div className="icon-and-text">
        {icon}
        {text}
      </div>
      <SwitchToggle boolValue={boolValue} setBoolValue={handleChangeToggle} />
    </SettingsItemWrapper>
  );
};

export default SettingsItem;
