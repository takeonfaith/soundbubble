import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { ContentContainer } from "../../components/Containers/ContentContainer";
import { LoadingCircle } from "../../components/Loading/LoadingCircle";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { ChatItem } from "../../features/chats/ui/organisms/chat-item";
import { CreateChat } from "../../features/chats/ui/organisms/create-chat";
import { fetchItemList } from "../../shared/lib/fetch-item-list";
import "../../styles/ChatPage.css";

const ChatPage = () => {
  const [yourChats, setYourChats] = useState([]);
  const { toggleModal, setContent } = useModal();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchItemList(
      currentUser.chats,
      "chats",
      setYourChats,
      (res) =>
        res.sort((a, b) => {
          if (a.messages.length && b.messages.length) {
            return (
              new Date(b.messages[b.messages.length - 1].sentTime).getTime() -
              new Date(a.messages[a.messages.length - 1].sentTime).getTime()
            );
          }
        }),
      () => setLoading(false)
    );
  }, []);

  return (
    <div style={{ animation: "zoomIn .2s forwards", minHeight: "100%" }}>
      <ContentContainer>
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "start",
            width: "100%",
          }}
        >
          <button
            className="standartButton"
            onClick={() => {
              toggleModal();
              setContent(<CreateChat />);
            }}
          >
            <FiPlus />
            Create chat
          </button>
        </div>
        {loading ? (
          <LoadingCircle />
        ) : (
          <div className="chatsWrapper">
            {yourChats.length ? (
              yourChats.map((chat, index) => {
                return <ChatItem chatData={chat} key={index} />;
              })
            ) : (
              <h3>No chats</h3>
            )}
          </div>
        )}
      </ContentContainer>
    </div>
  );
};

export default ChatPage;
