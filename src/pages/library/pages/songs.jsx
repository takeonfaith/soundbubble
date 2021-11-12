import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useAuth } from "../../../contexts/auth";
import { useModal } from "../../../contexts/modal";
import { useScreen } from "../../../contexts/screen";
import { useSong } from "../../../contexts/song";
import { AddPlaylist } from "../../../features/author/ui/organisms/add-playlist";
import { findVisiblePlaylists } from "../../../features/library/lib/find-visible-playlists";
import { SongList } from "../../../features/song/ui/templates/song-list";
import Button from "../../../shared/ui/atoms/button";
import wave from "../../../shared/ui/images/wave2.svg";
import { LibraryPlaylistItem } from "../ui/molecules/library-playlist-item";

const SongsPage = () => {
  const { yourSongs, yourPlaylists } = useSong();
  const { currentUser } = useAuth();
  const { screenWidth } = useScreen();
  const { toggleModal, setContent } = useModal();
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
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "40%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: "translate(-50%, -50%)",
              }}
            >
              <h3>You don't have playlists</h3>
              <Button
                text="Add playlist"
                icon={<FiPlus />}
                onClick={() => {
                  toggleModal();
                  setContent(<AddPlaylist />);
                }}
              />
            </div>
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

export default SongsPage;
