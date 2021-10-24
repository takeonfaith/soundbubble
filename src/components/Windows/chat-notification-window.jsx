import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LastSentMessage } from "../../features/chats/ui/molecules/last-sent-message";
import { firestore } from "../../firebase";
import shortWord from "../../functions/other/shortWord";
import notifSound from "../../music/notification.mp3";

const ChatNotificationWindowWrapper = styled.div`
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: var(--standartBorderRadius2);
  background: #000000b9;
  position: absolute;
  bottom: 20px;
  right: 20px;
  transition: 0.2s;
  transform: translateY(
    ${({ show, index }) => (!show ? "90px" : `-${index * 90 + index * 10}px`)}
  );
  opacity: ${({ show }) => (show ? "1" : "0")};
  width: 250px;
  height: 90px;

  a {
    text-decoration: none;
  }

  &:hover {
    background: #1f1f1fb3;
  }

  .image-and-name {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-weight: bold;

    img {
      width: 25px;
      height: 25px;
      border-radius: 100%;
      margin-right: 7px;
    }
  }

  .message {
    margin-top: 10px;
    display: flex;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const ChatNotificationWindow = ({
  chatId,
  chatName,
  chatImage,
  message,
  userId,
  index,
  notifsLen = 0,
}) => {
  const [userData, setUserData] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    firestore
      .collection("users")
      .doc(userId)
      .get()
      .then((res) => {
        setShow(true);
        const notificationSound = new Audio(notifSound);
        notificationSound.play();
        setUserData(res.data());
        setTimeout(() => {
          setShow(false);
        }, 4500);
      });
  }, []);

  return (
    <ChatNotificationWindowWrapper show={show} index={index}>
      <Link to={`/chat/${chatId}`}>
        <div className="image-and-name">
          <img
            src={chatImage?.length ? chatImage : userData?.photoURL}
            alt=""
          />
          {chatName.length ? chatName : userData?.displayName}
        </div>
        <div className="message">
          <LastSentMessage
            sender={userData}
            isGroup={chatName.length}
            message={message}
            messageLen={20}
          />
        </div>
      </Link>
    </ChatNotificationWindowWrapper>
  );
};

export default ChatNotificationWindow;
