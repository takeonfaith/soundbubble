import React, { memo, useMemo, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAuth } from "../../../../contexts/auth";
import { useScreen } from "../../../../contexts/screen";
import useChat from "../../lib/hooks/use-chat";
import { TypingAnimation } from "../atoms/typing-animation";
import SystemMessage from "../molecules/system-message";
import { MessageField } from "./message-field";

export const ChatMessagesWindow = memo(
  ({
    chatId,
    chatData,
    messageList,
    findTopDate,
    inResponseToMessage,
    setInResponseToMessage,
    setDateRefsArray,
  }) => {
    const { screenHeight } = useScreen();
    const messagesWindowRef = useRef(null);
    const { participantsData, attachedData } = useChat(chatData);
    const { currentUser } = useAuth();
    const isNotSeenIndex = useMemo(() => {
      return messageList.findIndex(
        (message) =>
          !!message.seenBy && !message.seenBy.includes(currentUser.uid)
      );
    }, []);

    return (
      <Virtuoso
        increaseViewportBy={{ top: 50, bottom: 50 }}
        style={{
          height: screenHeight - 105 + "px",
          scrollBehavior: "initial",
          overflowX: "hidden",
          marginTop: 0,
        }}
        data={messageList}
        totalCount={messageList.length}
        // initialTopMostItemIndex={
        //   isNotSeenIndex !== -1
        //     ? isNotSeenIndex - 10
        //     : messageList?.length > 20
        //     ? messageList?.length - 1
        //     : 0
        // }
        components={{
          Footer: () => {
            return <TypingAnimation typingPeople={chatData.typing} />;
          },
        }}
        followOutput="smooth"
        itemContent={(index, message) => {
          return message.sender !== "soundbubble" ? (
            <MessageField
              message={message}
              index={index}
              key={message.id}
              messageList={messageList}
              chatId={chatId}
              setDateRefsArray={setDateRefsArray}
              inResponseToMessage={inResponseToMessage}
              setInResponseToMessage={setInResponseToMessage}
              participantsData={participantsData}
              attachedData={attachedData}
              isNotSeen={isNotSeenIndex === index}
            />
          ) : (
            <SystemMessage
              chatId={chatId}
              message={message}
              messageList={messageList}
            />
          );
        }}
        onScroll={findTopDate}
        ref={messagesWindowRef}
      />
    );
  }
);
