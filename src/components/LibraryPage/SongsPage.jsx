import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useScreen } from "../../contexts/ScreenContext";
import { useSong } from "../../contexts/SongContext";
import { findVisiblePlaylists } from "../../functions/find/findVisiblePlaylists";
import wave from "../../images/wave2.svg";
import { SongList } from "../Lists/SongList";
import { LibraryPlaylistItem } from "./LibraryPlaylistItem";
export const SongsPage = () => {
  const { yourSongs, yourPlaylists } = useSong();
  const { currentUser } = useAuth();
  const { screenWidth } = useScreen();
  const [playlistsVisible, setPlaylistsVisible] = useState(
    findVisiblePlaylists(screenWidth)
  );
  useEffect(() => {
    setPlaylistsVisible(findVisiblePlaylists(screenWidth));
  }, [screenWidth]);
  return (
    <div className="SongsPage">
      <div className="playLists">
        <div className="playlistContent">
          {yourPlaylists.length ? (
            yourPlaylists.map((p, index) => {
              if (index < playlistsVisible) {
                return <LibraryPlaylistItem playlist={p} key={index} />;
              }
            })
          ) : (
            <h3
              style={{
                position: "absolute",
                left: "50%",
                top: "40%",
                transform: "translate(-50%, -50%)",
              }}
            >
              You don't have playlists
            </h3>
          )}
        </div>
        <div className="playlistsBackground">
          <img loading="lazy" src={wave} alt="wave" />
        </div>
      </div>
      <div className="yourSongsList">
        <SongList
          listOfSongs={yourSongs}
          source={{
            source: "/library",
            name: "Your Library",
            image: currentUser.photoURL,
            songsList: yourSongs,
          }}
          showSearch
          showhistory
          displayIfEmpty={<h3>Your library is empty</h3>}
        />
      </div>
    </div>
  );
};
