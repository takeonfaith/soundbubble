import React, { useEffect, useRef } from "react";
import { useScreen } from "../../../../contexts/screen";
import { TypingAnimation } from "../atoms/typing-animation";
import { DisplayChatMessages } from "../molecules/display-chat-messages";

export const ChatMessagesWindow = ({
  chatId,
  chatData,
  messageList,
  findTopDate,
  inResponseToMessage,
  setInResponseToMessage,
  setDateRefsArray,
}) => {
  const { screenHeight, isMobile } = useScreen();
  const messagesWindowRef = useRef(null);

  const scrollToBottom = () => {
    const scroll =
      messagesWindowRef.current?.scrollHeight -
      messagesWindowRef.current?.clientHeight;
    messagesWindowRef.current?.scrollTo(0, scroll);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  }, [messageList]);
  return (
    <div
      className="chatMessagesWindow"
      ref={messagesWindowRef}
      onScroll={findTopDate}
      style={{
        height: screenHeight - 105 + "px",
      }}
    >
      <DisplayChatMessages
        chatId={chatId}
        messageList={messageList}
        inResponseToMessage={inResponseToMessage}
        setInResponseToMessage={setInResponseToMessage}
        messagesWindowRef={messagesWindowRef}
        setDateRefsArray={setDateRefsArray}
      />
      <TypingAnimation typingPeople={chatData.typing} />
    </div>
  );
};
