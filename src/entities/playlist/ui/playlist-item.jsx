import React, { memo, useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/auth";
import { useScreen } from "../../../contexts/screen";
import { useSong } from "../../../contexts/song";
import getShortString from "../../../shared/lib/get-short-string";
import { AddToListCircle } from "../../../shared/ui/molecules/add-to-list-circle";
import saveSearchHistory from "../../../features/search/lib/save-search-history";
import { DeletedPlaylist } from "./molecules/deleted-playlist";
import { usePlaylistSongs } from "../lib/hooks/use-playlist-songs";
export const PlaylistItem = memo(
  ({
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
              ? { background: playlist.imageColors[0] }
              : { background: "var(--yellowAndPinkGrad)" }
          }
        >
          <img src={playlist.image} alt="" loading="lazy" />
          {!playlist.image && (
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
          )}
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
  }
);
