import React, { memo, useEffect, useMemo, useState } from "react";
import { BiShare } from "react-icons/bi";
import { useSwipeable } from "react-swipeable";
import { useAuth } from "../../../../contexts/auth";
import { useScreen } from "../../../../contexts/screen";
import useMarkMessageRead from "../../lib/hooks/use-mark-message-read";
import MessageItemBody from "../atoms/message-item.body";
import { SeenByCircle } from "../atoms/seen-by-circle";

export const MessageItem = memo(
  ({
    messageData,
    chatId,
    showPhoto = true,
    otherMessages,
    inResponseToMessageArr,
    setInResponseToMessageArr,
    participantsData,
    attachedData,
  }) => {
    const { currentUser } = useAuth();
    const { isMobile } = useScreen();
    const { sender, id } = messageData;
    const senderData = useMemo(
      () => participantsData[sender],
      [participantsData, sender]
    );

    const [messageRef, isVisible] = useMarkMessageRead(
      chatId,
      messageData,
      otherMessages
    );
    const [swipeDeltaX, setSwipeDeltaX] = useState(0);
    const [transformTransition, setTransformTransition] = useState(0);
    const handlers = useSwipeable({
      onSwiping: (event) => {
        if (event.deltaX < 0) setSwipeDeltaX(event.deltaX);
      },
    });
    const refPassthrough = (el) => {
      // call useSwipeable ref prop with el
      handlers.ref(el);

      // set myRef el so you can access it yourself
      messageRef.current = el;
    };

    function addMessageToResponseList() {
      if (!inResponseToMessageArr.includes(id)) {
        setInResponseToMessageArr((prev) => [...prev, id]);
      }
    }

    function returnToInitial() {
      let dropDelta;
      clearTimeout(dropDelta);
      setTransformTransition(0.2);
      dropDelta = setTimeout(() => {
        setSwipeDeltaX(0);
        setTransformTransition(0);
      }, 200);
    }

    useEffect(() => {
      if (swipeDeltaX < -160) {
        returnToInitial();
        addMessageToResponseList();
      }
    }, [swipeDeltaX]);

    return (
      <div
        className={"MessageItem " + (sender === currentUser.uid ? "your" : "")}
        ref={messageRef}
        style={
          showPhoto
            ? {
                paddingBottom: "15px",
                transform: `translateX(${swipeDeltaX}px)`,
                transition: transformTransition,
              }
            : {
                transform: `translateX(${swipeDeltaX}px)`,
                transition: transformTransition,
              }
        }
        onTouchEnd={returnToInitial}
      >
        <div className="messageItemImage">
          {showPhoto ? (
            <img loading="lazy" src={senderData?.photoURL} alt="" />
          ) : null}
        </div>
        <MessageItemBody
          showPhoto={showPhoto}
          messageData={messageData}
          attachedData={attachedData}
          participantsData={participantsData}
          senderData={senderData}
          allMessages={otherMessages}
        />
        <SeenByCircle listOfSeen={messageData.seenBy} />
        <button
          className="respondToMessageBtn"
          onClick={addMessageToResponseList}
          style={isMobile ? { opacity: -swipeDeltaX / 80 } : {}}
        >
          <BiShare />
        </button>
      </div>
    );
  }
);
