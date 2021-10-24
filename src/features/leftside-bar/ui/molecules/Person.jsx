import React, { useEffect, useState } from "react";
import { BiShare } from "react-icons/bi";
import { FiMessageCircle, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Hint } from "../../../../components/Basic/Hint";
import { IsUserOnlineCircle } from "../../../../components/Basic/IsUserOnlineCircle";
import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import { useSong } from "../../../../contexts/SongContext";
import { createChat } from "../../../../shared/lib/create-сhat";
import { findChatURL } from "../../../../shared/lib/find-chat-url";
import shareWithManyFriends from "../../../../functions/other/shareWithManyFriends";

export const Person = ({ index, friend }) => {
  const { currentUser } = useAuth();
  const { openBottomMessage } = useModal();
  const [friendChatId, setFriendChatId] = useState(0);
  const [shouldCreate, setShouldCreate] = useState(false);
  const [sendAnimation, setSendAnimation] = useState("");
  const { currentSong, currentSongData } = useSong();
  const [loadingSendSong, setLoadingSendSong] = useState(false);
  useEffect(() => {
    findChatURL([friend.uid], currentUser, setShouldCreate, setFriendChatId);
  }, []);

  useEffect(() => {
    if (sendAnimation?.length > 0) {
      setLoadingSendSong(true);
      setTimeout(() => {
        setSendAnimation("");
        setLoadingSendSong(false);
      }, 600);
    }
  }, [sendAnimation]);
  return (
    <div className="person" key={index} id={friend.uid}>
      <img
        loading="lazy"
        src={currentSongData.cover}
        alt=""
        className={"sendSongImage " + sendAnimation}
      />
      <div className="personBtns">
        <Link to={`/chat/${friendChatId}`}>
          <button
            onClick={() => {
              if (shouldCreate)
                createChat([currentUser.uid, friend.uid], friendChatId);
            }}
          >
            <Hint text={"chat"} />
            <FiMessageCircle />
          </button>
        </Link>
        <Link to={`/authors/${friend.uid}`}>
          <button>
            <Hint text={"profile"} />
            <FiUser />
          </button>
        </Link>
        <button
          onClick={() => {
            if (!loadingSendSong) {
              shareWithManyFriends(
                [friend.uid],
                currentUser,
                currentSong,
                "song",
                "",
                setShouldCreate,
                setFriendChatId
              );
              setSendAnimation("sendAnimation");
              openBottomMessage(
                `${currentSongData.name} was sent to ${friend.displayName}`
              );
            }
          }}
        >
          <Hint text={"share"} />
          <BiShare />
        </button>
      </div>
      <Link
        className="pesronImg"
        style={{ pointerEvents: "none" }}
        to={`/authors/${friend.uid}`}
      >
        <img loading="lazy" src={friend.photoURL} alt="" />
      </Link>
      <IsUserOnlineCircle userUID={friend.uid} />
      <div className="personName" style={{ pointerEvents: "none" }}>
        {friend.displayName}
      </div>
    </div>
  );
};
