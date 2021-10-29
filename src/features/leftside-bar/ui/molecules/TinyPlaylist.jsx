import React, { useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { FiCheck, FiPlayCircle, FiPlusCircle, FiShare } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import { Hint } from "../../../../components/Basic/Hint";
import { FriendsListToShareWith } from "../../../../components/Lists/FriendsListToShareWith";
import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import { useAddOrDeleteSong } from "../../../../hooks/useAddOrDeleteSong";
import { usePlaylistSongs } from "../../../../hooks/usePlaylistSongs";
import getShortString from "../../../../shared/lib/get-short-string";

export const TinyPlaylist = ({ playlist }) => {
  const { toggleModal, setContent } = useModal();
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const playSongsInPlaylist = usePlaylistSongs(
    playlist,
    playlistSongs,
    setPlaylistSongs
  );
  const [addFunc, isAdded] = useAddOrDeleteSong(playlist.id);
  const { currentUser } = useAuth();
  const history = useHistory();
  return (
    <div className="TinyPlaylist">
      <div className="TinyPlaylistBtns">
        {playlist.authors.find((author) => author.uid === currentUser.uid) ? (
          <button onClick={addFunc}>
            {isAdded ? (
              <>
                <Hint text={`remove song`} />
                <FiCheck />
              </>
            ) : (
              <>
                <Hint text={"add song"} />
                <FiPlusCircle />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              toggleModal();
              setContent(
                <FriendsListToShareWith
                  item={playlist}
                  whatToShare={"playlist"}
                />
              );
            }}
          >
            <Hint text={"share"} />
            <FiShare />
          </button>
        )}
        <Link to={`/albums/${playlist.id}`}>
          <button>
            <Hint text={"album"} />
            <BiAlbum />
          </button>
        </Link>
        <button onClick={playSongsInPlaylist}>
          <Hint text={"play"} />
          <FiPlayCircle />
        </button>
      </div>
      <div
        className="TinyPlaylistImg"
        style={{
          backgroundImage: `url(${playlist.image})`,
          display: "inline-block",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          position: "relative",
        }}
        onClick={() => history.push(`/albums/${playlist.id}`)}
      >
        {!playlist.image ? (
          <BiAlbum
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "20px",
            }}
          />
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>{getShortString(playlist.name, 13)}</span>
        <span style={{ fontSize: "0.8em", color: "grey", fontWeight: "500" }}>
          {playlist.isAlbum ? "album" : "playlist"}
        </span>
      </div>
    </div>
  );
};
