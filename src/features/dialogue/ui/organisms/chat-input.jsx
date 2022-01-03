import React, { memo, useEffect, useRef, useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { CgMusicNote } from "react-icons/cg";
import { FiUser, FiX } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useAuth } from "../../../../contexts/auth";
import { useSong } from "../../../../contexts/song";
import { firestore } from "../../../../firebase";
import { whatToWriteInResponseToItem } from "../../lib/what-to-write-in-response-item";

import useOutsideClick from "../../../../shared/lib/hooks/use-outside-click";
import SearchBar from "../../../../shared/ui/organisms/search-bar";
import { AlbumList } from "../../../album/ui/template/album-list";
import { AuthorsList } from "../../../../features/author/ui/templates/authors-list";
import { SongList } from "../../../../features/song/ui/templates/song-list";
import { AttachedItemsInChatInput } from "../molecules/attached-items-in-chat-input";
import getShortString from "../../../../shared/lib/get-short-string";
import { sendMessage } from "../../lib/send-message";
import useChatHeader from "../../lib/hooks/use-chat-header";
import NotAllowedToSendMessages from "../molecules/not-allowed-to-send-messages";
import useChatInput from "../../lib/hooks/use-chat-input";

export const ChatInput = memo(
  ({
    chatId,
    chatData,
    messageText,
    setMessageText,
    inResponseToMessage,
    setInResponseToMessage,
    otherMessages,
  }) => {
    const [otherPerson, headerColors] = useChatHeader(chatData);
    const { yourFriends } = useSong();
    const { currentUser } = useAuth();
    const {
      openAttachWindow,
      setOpenAttachWindow,
      attachWindowRef,
      searchValue,
      setSearchValue,
      setAllFoundSongs,
      setResultPlaylists,
      setResultAuthorList,
      allFoundSongs,
      setAttachedSongs,
      resultAuthorList,
      resultPlaylists,
      attachedAuthors,
      attachedAlbums,
      attachedSongs,
      setAttachedAuthors,
      setAttachedAlbums,
      attachedSongsNames,
      removeMessageFromResponseList,
      inResponseNames,
      sendMessageFull,
    } = useChatInput(
      chatId,
      chatData,
      inResponseToMessage,
      setInResponseToMessage,
      messageText,
      setMessageText,
      otherMessages
    );

    if (
      !!otherPerson.uid &&
      !yourFriends.find((friend) => friend.uid === otherPerson.uid)
    ) {
      return <NotAllowedToSendMessages />;
    }

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
            attachedSongs.length ||
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
                    {getShortString(otherMessages[id].message, 35)}
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
            list={allFoundSongs}
            attachedItems={attachedSongs}
            setAttachedItems={setAttachedSongs}
            icon={<CgMusicNote />}
          />
          <AttachedItemsInChatInput
            list={resultAuthorList}
            attachedItems={attachedAuthors}
            setAttachedItems={setAttachedAuthors}
            icon={<FiUser />}
          />
          <AttachedItemsInChatInput
            list={resultPlaylists}
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
  }
);
