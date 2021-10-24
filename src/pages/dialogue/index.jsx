import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { LoadingCircle } from "../../components/Loading/LoadingCircle";
import { useAuth } from "../../contexts/AuthContext";
import { DateOnTop } from "../../features/dialogue/ui/atoms/date-on-top";
import { ChatHeader } from "../../features/dialogue/ui/organisms/chat-header";
import { ChatInput } from "../../features/dialogue/ui/organisms/chat-input";
import { ChatMessagesWindow } from "../../features/dialogue/ui/organisms/chat-messages-window";
import { useRealTimeMessages } from "../../hooks/useRealTimeMessages";

const DialoguePage = () => {
  const match = useRouteMatch("/chat/:chatId");
  const { currentUser } = useAuth();
  const { chatId } = match.params;
  const [messageText, setMessageText] = useState("");
  const [inResponseToMessage, setInResponseToMessage] = useState([]);
  const [dateRefsArray, setDateRefsArray] = useState([]);
  const history = useHistory();
  const [chatData, messageList, loading, currentDateOnTop, findTopDate] =
    useRealTimeMessages(chatId, dateRefsArray);

  useEffect(() => {
    if (chatData === undefined) {
      history.push("/not-found");
    } else if (chatData?.participants !== undefined) {
      if (!chatData.participants.includes(currentUser.uid))
        history.push("/chat");
    }
  }, [chatData]);

  return chatData !== null && chatData !== undefined ? (
    <div className="DialoguePage" style={{ height: "100%" }}>
      {loading ? (
        <LoadingCircle top={"50%"} />
      ) : (
        <>
          <ChatHeader data={chatData} />
          <DateOnTop date={currentDateOnTop} />
          <ChatMessagesWindow
            chatId={chatId}
            chatData={chatData}
            messageList={messageList}
            findTopDate={findTopDate}
            setDateRefsArray={setDateRefsArray}
            inResponseToMessage={inResponseToMessage}
            setInResponseToMessage={setInResponseToMessage}
          />
          <ChatInput
            chatId={chatId}
            chatData={chatData}
            messageText={messageText}
            setMessageText={setMessageText}
            inResponseToMessage={inResponseToMessage}
            setInResponseToMessage={setInResponseToMessage}
            otherMessages={messageList}
          />
        </>
      )}
      {chatData?.wallpaper !== "undefined" ? (
        <img
          loading="lazy"
          src={chatData.wallpaper}
          className="chatWallpaper"
          alt=""
        />
      ) : null}
    </div>
  ) : null;
};

export default DialoguePage;
