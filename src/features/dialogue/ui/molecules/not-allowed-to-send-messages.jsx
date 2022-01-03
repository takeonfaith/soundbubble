import React from "react";
import styled from "styled-components";

const NotAllowedToSendMessagesWrapper = styled.div`
  background: var(--yellowAndOrangeGrad);
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-sizing: border-box;

  @media (max-width: 800px) {
    font-size: 0.8em;
  }
`;

const NotAllowedToSendMessages = () => {
  return (
    <NotAllowedToSendMessagesWrapper>
      You are not allowed to send any messages since this person is not in your
      friend list
    </NotAllowedToSendMessagesWrapper>
  );
};

export default NotAllowedToSendMessages;
