import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import useLastSongListened from "../../lib/hooks/use-last-song-listened";
export const LastSongListened = ({ data, loading }) => {
  const [songData, chooseSongItem] = useLastSongListened(data, loading);
  return songData !== undefined ? (
    <div className="LastSongListened" onClick={chooseSongItem}>
      <IoPlayCircleOutline />
      <span>{songData.name}</span>
    </div>
  ) : null;
};
