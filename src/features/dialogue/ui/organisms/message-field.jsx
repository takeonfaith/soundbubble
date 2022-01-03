import React, { memo, useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import displayDate from "../../../../shared/lib/display-date";
import { MessageItem } from "../molecules/message-item";
import NewMessagesPlateWrapper from "../atoms/new-messages-plate";
import { useAuth } from "../../../../contexts/auth";

export const MessageField = memo(
  ({
    message,
    index,
    messageList,
    chatId,
    inResponseToMessage,
    setInResponseToMessage,
    scrollToMessageRef,
    scrollToMessageId,
    setScrollToMessageId,
    setDateRefsArray,
    participantsData,
    attachedData,
    isNotSeen,
  }) => {
    const [showPhoto, setShowPhoto] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const dateRef = useRef(null);
    useEffect(() => {
      if (index === messageList.length - 1) setShowPhoto(true);
      else if (messageList[index + 1].sender !== messageList[index].sender)
        setShowPhoto(true);
      else if (
        displayDate(messageList[index + 1].sentTime) !==
        displayDate(messageList[index].sentTime)
      )
        setShowPhoto(true);

      if (index === 0) setShowDate(true);
      else if (
        displayDate(messageList[index].sentTime) !==
        displayDate(messageList[index - 1].sentTime)
      ) {
        setShowDate(true);
      }
    }, [messageList.length]);

    useEffect(() => {
      if (dateRef.current !== null) {
        setDateRefsArray((prev) => [...prev, dateRef]);
      }
    }, [showDate]);

    return (
      <>
        {showDate ? (
          <div
            ref={dateRef}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            {displayDate(message.sentTime)}
          </div>
        ) : null}
        <NewMessagesPlateWrapper isNotSeen={isNotSeen} />
        <MessageItem
          messageData={message}
          chatId={chatId}
          key={message.id}
          scrollToMessageRef={scrollToMessageRef}
          scrollToMessageId={scrollToMessageId}
          setScrollToMessageId={setScrollToMessageId}
          showPhoto={showPhoto}
          otherMessages={messageList}
          inResponseToMessageArr={inResponseToMessage}
          setInResponseToMessageArr={setInResponseToMessage}
          participantsData={participantsData}
          attachedData={attachedData}
        />
      </>
    );
  }
);
