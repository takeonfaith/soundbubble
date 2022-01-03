import React from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../../../contexts/modal";
import { GoBackBtn } from "../../../../shared/ui/atoms/go-back-button";
import { LastSeen } from "../../../../shared/ui/atoms/last-seen";
import useChatHeader from "../../lib/hooks/use-chat-header";
import { ChatMoreBtn } from "../molecules/chat-more-button";
import { ChatInfo } from "./chat-info";

export const ChatHeader = ({ data }) => {
  const { toggleModal, setContent } = useModal();
  const [otherPerson, headerColors] = useChatHeader(data);

  return (
    <div
      className="ChatHeader"
      style={
        headerColors?.length
          ? {
              background: `linear-gradient(45deg, ${headerColors[0]}, ${headerColors[1]})`,
            }
          : {}
      }
    >
      <GoBackBtn />
      {data.chatName.length === 0 ? (
        <Link
          className="chatHeaderImageAndName"
          to={`/authors/${otherPerson.uid}`}
        >
          <div
            className="chatHeaderImage"
            style={{
              backgroundImage: `url(${otherPerson.photoURL || data.chatImage})`,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h4>{otherPerson.displayName || data.chatName}</h4>
            <LastSeen userUID={otherPerson.uid} />
          </div>
        </Link>
      ) : (
        <div
          className="chatHeaderImageAndName"
          onClick={() => {
            toggleModal();
            setContent(<ChatInfo data={data} />);
          }}
        >
          <div
            className="chatHeaderImage"
            style={{
              backgroundImage: `url(${otherPerson.photoURL || data.chatImage})`,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h4>{otherPerson.displayName || data.chatName}</h4>
            <LastSeen userUID={otherPerson.uid} />
          </div>
        </div>
      )}
      <ChatMoreBtn
        chatId={data.id}
        data={data}
        currentWallpaper={data.wallpaper}
      />
    </div>
  );
};
