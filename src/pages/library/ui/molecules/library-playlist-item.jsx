import React, { useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useScreen } from "../../../../contexts/screen";
import { useSong } from "../../../../contexts/song";
import { usePlaylistSongs } from "../../../../entities/playlist/lib/hooks/use-playlist-songs";
import getShortString from "../../../../shared/lib/get-short-string";
export const LibraryPlaylistItem = ({ playlist }) => {
  const { currentSongPlaylistSource, play } = useSong();
  const { isMobile } = useScreen();
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const playSongsInPlaylist = usePlaylistSongs(
    playlist,
    playlistSongs,
    setPlaylistSongs
  );

  return (
    <Link to={`/albums/${playlist.id}`} className="playlistWrapper">
      <div
        className="library playlistItem"
        style={{ backgroundImage: `url(${playlist.image})` }}
      >
        <h2 style={{ background: playlist.imageColors[2] }}>
          {getShortString(playlist.name, 10)}
        </h2>
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
    </Link>
  );
};
