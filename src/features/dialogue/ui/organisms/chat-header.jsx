import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LastSeen } from "../../../../components/Basic/LastSeen";
import { ChatMoreBtn } from "../molecules/chat-more-button";
import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import { firestore } from "../../../../firebase";
import { ChatInfo } from "./chat-info";
import { GoBackBtn } from "../../../../shared/ui/atoms/go-back-button";

export const ChatHeader = ({ data }) => {
  const { currentUser } = useAuth();
  const { toggleModal, setContent } = useModal();
  const [otherPerson, setOtherPerson] = useState({});
  const [headerColors, setHeaderColors] = useState(
    !!data.chatName ? [] : data.imageColors
  );
  async function fetchOtherPerson() {
    const otherPersonId = data.participants.find(
      (personId) => personId !== currentUser.uid
    );
    const person = (
      await firestore.collection("users").doc(otherPersonId).get()
    ).data();
    setOtherPerson(person);
    setHeaderColors(person.imageColors);
  }

  useEffect(() => {
    if (!data.chatName.length) {
      fetchOtherPerson();
    }
  }, [data.id]);
  return (
    <div
      className="ChatHeader"
      style={
        headerColors.length
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
