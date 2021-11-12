import React, { useEffect, useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import { FiMusic, FiUser } from "react-icons/fi";
import { useAuth } from "../../../../contexts/auth";
import { SeenByCircle } from "../../../dialogue/ui/atoms/seen-by-circle";
import { firestore } from "../../../../firebase";
import { TypingAnimation } from "../../../dialogue/ui/atoms/typing-animation";
import getShortString from "../../../../shared/lib/get-short-string";

export const LastSentMessage = ({
  sender,
  isGroup,
  message,
  showUnseenCircle = false,
  messageLen = 30,
  chatId,
  typing = false,
}) => {
  const { currentUser } = useAuth();
  const [lastAttachedItem, setLastAttachedItem] = useState("");
  const [shouldPutDot, setShouldPutDot] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const messageIcons = [null, <FiMusic />, <BiAlbum />, <FiUser />];
  const [lastIcon, setLastIcon] = useState(0);

  async function findWhatToWriteUnderName() {
    setLastMessage("");
    if (message !== undefined) {
      const lastAttachedItem = message;
      setLastMessage((str) => (str += lastAttachedItem.message));
      setShouldPutDot(lastAttachedItem.message.length !== 0);
      if (lastAttachedItem.attachedSongs.length) {
        const songName = (
          await firestore
            .collection("songs")
            .doc(lastAttachedItem.attachedSongs[0])
            .get()
        ).data().name;
        setLastIcon(1);
        setLastAttachedItem((str) => (str += songName));
      }
      if (lastAttachedItem.attachedAlbums.length) {
        const playlistName = await firestore
          .collection("playlists")
          .doc(lastAttachedItem.attachedAlbums[0])
          .get();
        if (playlistName.exists)
          setLastAttachedItem((str) => (str += playlistName.data().name));
        else setLastAttachedItem((str) => (str += "Deleted Album "));
        setLastIcon(2);
      }
      if (lastAttachedItem.attachedAuthors.length) {
        const authorName = (
          await firestore
            .collection("users")
            .doc(lastAttachedItem.attachedAuthors[0])
            .get()
        ).data().displayName;
        setLastIcon(3);
        setLastAttachedItem((str) => (str += authorName));
      }
    }
  }

  useEffect(() => {
    findWhatToWriteUnderName();
  }, [message.id]);
  return !typing ? (
    <div className="messageShowOutside">
      <span
        style={
          message.sender === currentUser.uid || (!!sender && isGroup)
            ? { marginRight: "5px" }
            : {}
        }
      >
        {" "}
        {`${
          message.sender === currentUser.uid
            ? "You: "
            : isGroup
            ? sender
              ? sender.displayName + ": "
              : ""
            : ""
        }`}
      </span>
      {getShortString(lastMessage, messageLen)}
      {shouldPutDot && lastAttachedItem.length ? <BsDot /> : null}
      {messageIcons[lastIcon]}
      {lastAttachedItem}
      {showUnseenCircle && <SeenByCircle listOfSeen={message.seenBy} />}
    </div>
  ) : (
    <TypingAnimation typingPeople={[sender.uid]} />
  );
};
