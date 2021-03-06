import React, { useEffect, useRef, useState } from "react";
import { MessageField } from "../organisms/message-field";
import SystemMessage from "./system-message";

export const DisplayChatMessages = ({
  chatId,
  messageList,
  inResponseToMessage,
  setInResponseToMessage,
  messagesWindowRef,
  setDateRefsArray,
}) => {
  const scrollToMessageRef = useRef(null);
  const [scrollToMessageId, setScrollToMessageId] = useState(-1);
  useEffect(() => {
    if (scrollToMessageId !== -1) {
      messagesWindowRef.current.scrollTo(
        0,
        scrollToMessageRef.current.offsetTop - 65 < 0
          ? 0
          : scrollToMessageRef.current.offsetTop - 65
      );
      setTimeout(() => {
        setScrollToMessageId(-1);
      }, 500);
    }
  }, [scrollToMessageId]);

  return messageList.length ? (
    <>
      {messageList.map((message, index) => {
        if (message.sender !== "soundbubble") {
          return (
            <MessageField
              message={message}
              index={index}
              key={message.id}
              messageList={messageList}
              chatId={chatId}
              inResponseToMessage={inResponseToMessage}
              setInResponseToMessage={setInResponseToMessage}
              scrollToMessageRef={scrollToMessageRef}
              scrollToMessageId={scrollToMessageId}
              setScrollToMessageId={setScrollToMessageId}
              setDateRefsArray={setDateRefsArray}
            />
          );
        } else {
          return (
            <SystemMessage
              chatId={chatId}
              message={message}
              messageList={messageList}
            />
          );
        }
      })}
    </>
  ) : null;
};
