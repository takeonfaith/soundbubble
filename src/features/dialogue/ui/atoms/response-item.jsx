import React, { useMemo } from "react";
import styled from "styled-components";
import { useAuth } from "../../../../contexts/auth";
import displayDate from "../../../../shared/lib/display-date";
import { whatToWriteInResponseToItem } from "../../lib/what-to-write-in-response-item";

const ResponseItemWrapper = styled.div`
  .response-name-and-date {
    display: flex;
    align-items: center;

    h5 {
      color: ${({ areYouSender }) =>
        areYouSender ? "var(--lightPurple)" : ""};
    }

    div {
      font-size: 0.7em;
      opacity: 0.8;
      margin-left: 10px;
    }
  }

  .response-message {
    display: flex;
    row-gap: 7px;
    span {
      color: var(--reallyLightBlue);
    }
  }
`;

const ResponseItem = ({ allMessages, messageId, participantsData }) => {
  const messageData = useMemo(() => allMessages[messageId], []);
  const { currentUser } = useAuth();

  return (
    <ResponseItemWrapper
      className="responseItem"
      areYouSender={messageData.sender === currentUser.uid}
    >
      <span className="response-name-and-date">
        <h5>{participantsData[messageData.sender]?.displayName}</h5>
        <div>{displayDate(messageData.sentTime, 2)}</div>
      </span>
      <p className="response-message">
        {messageData.message}
        <span style={{}}>{whatToWriteInResponseToItem(messageData)}</span>
      </p>
    </ResponseItemWrapper>
  );
};

export default ResponseItem;
