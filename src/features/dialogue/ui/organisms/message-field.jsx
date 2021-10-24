import React, { useEffect, useState } from "react";
import { useRef } from "react";
import displayDate from "../../../../functions/display/displayDate";
import { MessageItem } from "../molecules/message-item";

export const MessageField = ({
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
  }, []);

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
      />
    </>
  );
};
