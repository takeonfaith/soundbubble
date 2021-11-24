import React from "react";
import { FiChevronDown } from "react-icons/fi";
import styled from "styled-components";

const NewMessagesPlateWrapper = styled.div`
  width: 100%;
  height: 40px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #2c2c2c;
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
`;

const NewMessagesPlate = ({ isNotSeen = false }) => {
  return (
    isNotSeen && (
      <NewMessagesPlateWrapper>
        New messages
        <FiChevronDown />
      </NewMessagesPlateWrapper>
    )
  );
};

export default NewMessagesPlate;
