import React from "react";
import { Link } from "react-router-dom";
import { useSong } from "../../../../contexts/SongContext";
import getShortString from "../../../../shared/lib/get-short-string";
import { SongItem } from "../../../song/ui/organisms/song-item";

export const Queue = () => {
  const {
    currentSongQueue,
    currentSongPlaylistSource,
    setOpenFullScreenPlayer,
  } = useSong();
  return (
    <div className="Queue">
      <div className="queueNowIsPlaying">
        <h5 style={{ marginTop: 2 }}>
          Now is playing:
          <Link
            onClick={() => setOpenFullScreenPlayer(false)}
            to={currentSongPlaylistSource.source}
            className="queueAlbumName"
          >
            <div
              className="queueImage"
              style={currentSongPlaylistSource.image ? {} : { display: "none" }}
            >
              <img
                loading="lazy"
                src={currentSongPlaylistSource.image}
                alt=""
              />
            </div>
            <span>{getShortString(currentSongPlaylistSource.name, 25)}</span>
          </Link>
        </h5>
      </div>
      {currentSongQueue.map((song, index) => {
        return <SongItem song={song} localIndex={index} key={index} />;
      })}
    </div>
  );
};