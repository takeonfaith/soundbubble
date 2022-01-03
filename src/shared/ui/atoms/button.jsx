import React from "react";
import styled from "styled-components";

const ButtonWrapper = styled.button`
  border: none;
  color: var(--lightBlue);
  background: var(--lightGrey);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border-radius: var(--standartBorderRadius3);
  font-weight: 600;

  svg {
    margin-right: ${({ textLen }) => (textLen === 0 ? "0" : "5px")};
    width: 16px;
    height: 16px;
  }
`;

const Button = ({ text = "", icon, onClick, visible = true }) => {
  return (
    visible && (
      <ButtonWrapper onClick={onClick} textLen={text.length}>
        {icon}
        <span>{text}</span>
      </ButtonWrapper>
    )
  );
};

export default Button;
