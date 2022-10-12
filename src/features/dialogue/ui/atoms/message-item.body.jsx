import React, { useEffect, useMemo, useState } from "react";
import { useScreen } from "../../../../contexts/screen";
import { PlaylistItem } from "../../../../entities/playlist/ui/playlist-item";
import { SongItem } from "../../../../entities/song/ui/song-item";
import displayDate from "../../../../shared/lib/display-date";
import { fetchItemList } from "../../../../shared/lib/fetch-item-list";
import { AuthorItemBig } from "../../../author/ui/molecules/author-item-big";
import { LoadingCircle } from "../../../loading/ui/atoms/loading-circle";
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
  const messageSentTime = useMemo(() => displayDate(sentTime, 2), [sentTime]);
  const [finalSongs, setFinalSongs] = useState(attachedData.songs);
  const [finalUsers, setFinalUsers] = useState(attachedData.users);
  const [finalPlaylists, setFinalPlaylists] = useState(attachedData.playlists);

  useEffect(() => {
    attachedSongs.forEach((songId) => {
      if (!attachedData.songs[songId]) {
        fetchItemList([songId], "songs", setFinalSongs, (songs) => ({
          ...finalSongs,
          ...songs.reduce((acc, song) => (acc = { [song.id]: song }), {}),
        }));
      }
    });
    attachedAlbums.forEach((playlistId) => {
      if (!attachedData.playlists[playlistId]) {
        fetchItemList(
          [playlistId],
          "playlists",
          setFinalPlaylists,
          (playlists) => ({
            ...finalSongs,
            ...playlists.reduce(
              (acc, playlist) => (acc = { [playlist.id]: playlist }),
              {}
            ),
          })
        );
      }
    });
    attachedAuthors.forEach((authorId) => {
      if (!attachedData.users[authorId]) {
        fetchItemList([authorId], "users", setFinalUsers, (users) => ({
          ...finalSongs,
          ...users.reduce((acc, user) => (acc = { [user.uid]: user }), {}),
        }));
      }
    });
  }, [
    attachedAlbums,
    attachedAuthors,
    attachedData.playlists,
    attachedData.songs,
    attachedData.users,
    attachedSongs,
    finalSongs,
  ]);

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
          if (finalSongs[songId])
            return (
              <SongItem
                song={finalSongs[songId]}
                localIndex={key}
                key={key}
                position={screenHeight}
              />
            );
        })}
        {attachedAlbums.map((albumId, index) => {
          if (finalPlaylists[albumId])
            return (
              <PlaylistItem playlist={finalPlaylists[albumId]} key={index} />
            );
        })}
        {attachedAuthors.map((authorId, index) => {
          if (finalUsers[authorId])
            return <AuthorItemBig data={finalUsers[authorId]} key={index} />;
        })}
      </div>
    </div>
  );
};

export default MessageItemBody;
