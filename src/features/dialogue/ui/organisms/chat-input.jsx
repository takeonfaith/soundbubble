import React, { useEffect, useRef, useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { CgMusicNote } from "react-icons/cg";
import { FiUser, FiX } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSong } from "../../../../contexts/SongContext";
import { firestore } from "../../../../firebase";
import { whatToWriteInResponseToItem } from "../../lib/what-to-write-in-response-item";
import { sendMessage } from "../../../../functions/other/sendMessage";
import shortWord from "../../../../functions/other/shortWord";
import useOutsideClick from "../../../../shared/lib/hooks/use-outside-click";
import SearchBar from "../../../../shared/ui/organisms/search-bar";
import { AlbumList } from "../../../../components/Lists/AlbumList";
import { AuthorsList } from "../../../../components/Lists/AuthorsList";
import { SongList } from "../../../../components/Lists/SongList";
import { AttachedItemsInChatInput } from "../molecules/attached-items-in-chat-input";

export const ChatInput = ({
  chatId,
  chatData,
  messageText,
  setMessageText,
  inResponseToMessage,
  setInResponseToMessage,
  otherMessages,
}) => {
  const { currentUser } = useAuth();
  const [openAttachWindow, setOpenAttachWindow] = useState(false);
  const { yourSongs, yourAuthors, yourPlaylists } = useSong();
  const [searchValue, setSearchValue] = useState("");
  const [allFoundSongs, setAllFoundSongs] = useState(yourSongs);
  const [attachedSongs, setAttachedSongs] = useState([]);
  const [attachedAlbums, setAttachedAlbums] = useState([]);
  const [attachedAuthors, setAttachedAuthors] = useState([]);
  const [resultPlaylists, setResultPlaylists] = useState(yourPlaylists);
  const [resultAuthorList, setResultAuthorList] = useState(yourAuthors);
  const [inResponseNames, setInResponseNames] = useState([]);
  const [attachedSongsNames, setAttachedSongsNames] = useState([]);
  const attachWindowRef = useRef(null);
  useOutsideClick(attachWindowRef, setOpenAttachWindow);

  function sendMessageFull() {
    sendMessage(
      chatId,
      chatData,
      currentUser.uid,
      messageText,
      attachedSongs,
      attachedAlbums,
      attachedAuthors,
      inResponseToMessage
    );
    setMessageText("");
    setAttachedSongs([]);
    setAttachedAuthors([]);
    setAttachedAlbums([]);
    setInResponseToMessage([]);
    setOpenAttachWindow(false);
  }
  useEffect(() => {
    if (searchValue.length === 0) {
      setAllFoundSongs(yourSongs);
    }
  }, [searchValue]);

  function removeMessageFromResponseList(messageId) {
    setInResponseToMessage(
      inResponseToMessage.filter((id) => id !== messageId)
    );
  }

  useEffect(() => {
    if (messageText.length === 0) {
      firestore
        .collection("chats")
        .doc(chatId)
        .update({
          typing: chatData.typing.filter((id) => id !== currentUser.uid),
        });
    } else {
      if (!chatData.typing.includes(currentUser.uid)) {
        const tempArray = chatData.typing;
        tempArray.push(currentUser.uid);
        firestore.collection("chats").doc(chatId).update({
          typing: tempArray,
        });
      }
    }
  }, [messageText]);

  useEffect(() => {
    setInResponseNames([]);
    inResponseToMessage.forEach(async (id) => {
      const name = (
        await firestore.collection("users").doc(otherMessages[id].sender).get()
      ).data().displayName;
      setInResponseNames((prev) => [...prev, name]);
    });
  }, [inResponseToMessage.length]);

  useEffect(() => {
    setAttachedSongsNames([]);
    attachedSongs.forEach(async (id) => {
      const name = (await firestore.collection("songs").doc(id).get()).data()
        .name;
      setAttachedSongsNames((prev) => [...prev, name]);
    });
  }, [attachedSongs.length]);

  return (
    <div
      className="chatInput"
      style={
        openAttachWindow
          ? {
              borderRadius:
                "0 0 var(--standartBorderRadius) var(--standartBorderRadius)",
              transition: ".2s",
            }
          : {}
      }
      ref={attachWindowRef}
    >
      <div
        className="attachWindow"
        style={openAttachWindow ? { height: "400px", opacity: "1" } : {}}
      >
        {openAttachWindow ? (
          <div
            style={
              openAttachWindow
                ? {
                    maxHeight: "100%",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }
                : { display: "none" }
            }
          >
            <SearchBar
              value={searchValue}
              setValue={setSearchValue}
              setAllFoundSongs={setAllFoundSongs}
              setResultPlaylists={setResultPlaylists}
              setResultAuthorList={setResultAuthorList}
            />
            <div style={{ height: "100%", overflowY: "auto" }}>
              <SongList
                listOfSongs={allFoundSongs}
                source={"no"}
                listOfChosenSongs={attachedSongs}
                setListOfSongs={setAttachedSongs}
              />
              <AuthorsList
                listOfAuthors={resultAuthorList}
                listOfChosenAuthors={attachedAuthors}
                setListOfChosenAuthors={setAttachedAuthors}
              />
              <AlbumList
                listOfAlbums={resultPlaylists}
                loading={false}
                listOfChosenAlbums={attachedAlbums}
                setListOfChosenAlbums={setAttachedAlbums}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div
        className="inResponseArea"
        style={
          inResponseToMessage.length ||
          attachedSongsNames.length ||
          attachedAuthors.length ||
          attachedAlbums.length
            ? {}
            : {
                height: "0",
                padding: "0",
                opacity: "0",
                top: "0",
                visibility: "hidden",
              }
        }
      >
        <div className="responseMessages">
          {inResponseToMessage.map((id, index) => {
            return (
              <div className="responseItem" key={id}>
                <h5
                  style={
                    otherMessages[id].sender === currentUser.uid
                      ? { color: "var(--lightPurple)" }
                      : {}
                  }
                >
                  {inResponseNames[index]}
                </h5>
                <p>
                  {shortWord(otherMessages[id].message, 35)}
                  <span
                    style={{
                      marginLeft: "5px",
                      color: "var(--reallyLightBlue)",
                    }}
                  >
                    {whatToWriteInResponseToItem(otherMessages[id])}
                  </span>
                </p>
                <button
                  onClick={() => removeMessageFromResponseList(id)}
                  className="removeMessageFromResponse"
                >
                  <FiX />
                </button>
              </div>
            );
          })}
        </div>
        <AttachedItemsInChatInput
          attachedItems={attachedSongs}
          setAttachedItems={setAttachedSongs}
          icon={<CgMusicNote />}
        />
        <AttachedItemsInChatInput
          attachedItems={attachedAuthors}
          setAttachedItems={setAttachedAuthors}
          icon={<FiUser />}
        />
        <AttachedItemsInChatInput
          attachedItems={attachedAlbums}
          setAttachedItems={setAttachedAlbums}
          icon={<BiAlbum />}
        />
      </div>
      <div className="attachAndEmojis">
        <div className="attachBtn">
          <button
            onClick={() => {
              setOpenAttachWindow(!openAttachWindow);
            }}
          >
            <ImAttachment />
          </button>
        </div>
        <input
          type="text"
          style={{
            background: "var(--lightGrey)",
            border: "none",
            outline: "none",
            minHeight: "100%",
          }}
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessageFull();
            }
          }}
        />
        {/* <div className="emojis">
					<div className="emojiItem">
						<FcLike />
					</div>
					<div className="emojiItem" style={{ color: 'var(--red)' }}>
						<AiFillFire />
					</div>
					<div className="emojiItem" style={{ color: 'var(--lightBlue)' }}>
						<AiFillLike />
					</div>
				</div> */}
      </div>
      <button
        className="sendBtn"
        onClick={() => {
          sendMessageFull();
        }}
      >
        <MdSend />
      </button>
    </div>
  );
};
