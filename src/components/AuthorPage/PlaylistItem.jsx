import React, { useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useScreen } from "../../contexts/ScreenContext";
import { useSong } from "../../contexts/SongContext";
import getShortString from "../../shared/lib/get-short-string";
import { usePlaylistSongs } from "../../hooks/usePlaylistSongs";
import { DeletedPlaylist } from "../Playlist/DeletedPlaylist";
import { AddToListCircle } from "../../shared/ui/molecules/add-to-list-circle";
import saveSearchHistory from "../../features/search/lib/save-search-history";
export const PlaylistItem = ({
  playlist = null,
  listOfChosenAlbums,
  setListOfChosenAlbums,
  shouldSaveSearchHistory,
}) => {
  const playlistDate = new Date(playlist?.creationDate);
  const { isMobile } = useScreen();
  const { currentUser } = useAuth();
  const { currentSongPlaylistSource, play } = useSong();
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const playSongsInPlaylist = usePlaylistSongs(
    playlist,
    playlistSongs,
    setPlaylistSongs
  );

  const handleSaveSearchHistory = () => {
    if (shouldSaveSearchHistory)
      saveSearchHistory(currentUser.uid, playlist.id, "playlists");
  };

  return playlist !== null ? (
    <Link
      to={`/albums/${playlist.id}`}
      style={{ textDecoration: "none" }}
      className="playlistWrapper"
      onClick={handleSaveSearchHistory}
    >
      <AddToListCircle
        listOfChosenItems={listOfChosenAlbums}
        setListOfChosenItems={setListOfChosenAlbums}
        itemId={playlist.id}
      />
      <div
        className="playlistItem"
        style={
          playlist.image
            ? { backgroundImage: `url(${playlist.image})` }
            : { background: "var(--yellowAndPinkGrad)" }
        }
      >
        {!playlist.image ? (
          <BiAlbum
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "60px",
              height: "60px",
            }}
          />
        ) : null}
        {!isMobile ? (
          <button onClick={playSongsInPlaylist}>
            {currentSongPlaylistSource.name === playlist.name && play ? (
              <BsPauseFill />
            ) : (
              <BsPlayFill />
            )}
          </button>
        ) : null}
      </div>
      <h4 style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
        {getShortString(playlist.name, isMobile ? 10 : 15)}
        <span
          style={{
            fontSize: ".6em",
            opacity: 0.6,
            fontWeight: "500",
            marginLeft: "7px",
          }}
        >
          {playlist.isAlbum
            ? playlist.songs.length === 1
              ? "single"
              : "album"
            : "playlist"}
        </span>
      </h4>
      <h5 style={{ margin: "5px 0" }}>{playlistDate.getFullYear()}</h5>
    </Link>
  ) : (
    <DeletedPlaylist />
  );
};
