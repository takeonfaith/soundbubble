import React from "react";
import { FiXCircle } from "react-icons/fi";
import styled from "styled-components";
import Button from "./button";

const Wrapper = styled.div`
  width: 100%;
  position: relative;

  button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const InputWrapper = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border-radius: var(--standartBorderRadius);
  border: none;
  background: var(--leftSideBarColor);
  outline: none;
  color: #fff;
  font-weight: 600;
`;

const Input = ({
  title,
  type = "text",
  value,
  setValue,
  placeholder = "",
  required = false,
}) => {
  return (
    <>
      <h3>{title}</h3>
      <Wrapper>
        <InputWrapper
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={type}
          required={required}
        />
        <Button
          icon={<FiXCircle />}
          onClick={() => setValue("")}
          visible={!!value.length}
        />
      </Wrapper>
    </>
  );
};

export default Input;
