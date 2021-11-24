import React, { useMemo } from "react";
import { useAuth } from "../../../../contexts/auth";
import { useScreen } from "../../../../contexts/screen";
import { PlaylistItem } from "../../../../entities/playlist/ui/playlist-item";
import { SongItem } from "../../../../entities/song/ui/song-item";
import displayDate from "../../../../shared/lib/display-date";
import { AuthorItemBig } from "../../../author/ui/molecules/author-item-big";
import { whatToWriteInResponseToItem } from "../../lib/what-to-write-in-response-item";
import ResponseItem from "./response-item";

const MessageItemBody = ({
  showPhoto,
  messageData,
  attachedData,
  participantsData,
  senderData,
  allMessages,
}) => {
  const {
    message,
    inResponseToMessage,
    attachedSongs,
    attachedAuthors,
    attachedAlbums,
    sentTime,
  } = messageData;

  const { screenHeight } = useScreen();
  const messageSentTime = useMemo(() => displayDate(sentTime, 2), []);
  const { currentUser } = useAuth();

  return (
    <div className="messageItemBody">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <h5 className="messageUserName">{senderData?.displayName}</h5>
        <div style={{ fontSize: ".7em", opacity: ".8", marginLeft: "10px" }}>
          {messageSentTime}
        </div>
      </div>
      {inResponseToMessage !== null &&
        inResponseToMessage.map((messageId, index) => {
          return (
            <ResponseItem
              messageId={messageId}
              key={index}
              allMessages={allMessages}
              participantsData={participantsData}
            />
          );
        })}
      <div>
        <p>{message}</p>
        {attachedSongs.map((songId, key) => {
          if (attachedData.songs[songId])
            return (
              <SongItem
                song={attachedData.songs[songId]}
                localIndex={key}
                key={key}
                position={screenHeight}
              />
            );
        })}
        {attachedAlbums.map((albumId, index) => {
          if (attachedData.playlists[albumId])
            return (
              <PlaylistItem
                playlist={attachedData.playlists[albumId]}
                key={index}
              />
            );
        })}
        {attachedAuthors.map((authorId, index) => {
          if (attachedData.users[authorId])
            return (
              <AuthorItemBig data={attachedData.users[authorId]} key={index} />
            );
        })}
      </div>
    </div>
  );
};

export default MessageItemBody;
