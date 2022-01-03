import React from "react";
import { MdPlaylistAdd } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { FiInfo } from "react-icons/fi";
import { useSong } from "../../../../contexts/song";
import AddOrDeleteButtonFull from "../molecules/add-or-delete-song-button";
export const Options = () => {
  const { currentSongData, setRightSideCurrentPage } = useSong();
  return (
    <div className="Options">
      <div className="OptionItem">
        <AddOrDeleteButtonFull song={currentSongData} />
      </div>
      <div className="OptionItem" onClick={() => setRightSideCurrentPage(4)}>
        <BiUserCircle />
        Go to author
      </div>
      <div className="OptionItem" onClick={() => setRightSideCurrentPage(5)}>
        <MdPlaylistAdd />
        Add to playlist
      </div>
      <div className="OptionItem" onClick={() => setRightSideCurrentPage(6)}>
        <FiInfo />
        Info
      </div>
    </div>
  );
};
