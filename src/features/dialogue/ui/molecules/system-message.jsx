import React from "react";
import styled from "styled-components";
import useMarkMessageRead from "../../lib/hooks/use-mark-message-read";

const SystemMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
`;

const SystemMessage = ({ chatId, message, messageList }) => {
  const [messageRef, isVisible] = useMarkMessageRead(
    chatId,
    message,
    messageList
  );
  return (
    <SystemMessageWrapper ref={messageRef}>
      {message.message}
    </SystemMessageWrapper>
  );
};

export default SystemMessage;
