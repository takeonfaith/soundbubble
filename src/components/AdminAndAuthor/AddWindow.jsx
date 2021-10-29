import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { Slider } from "../../shared/ui/molecules/slider";
import { AddPlaylist } from "../AddWindow/AddPlaylist";
import { AddSong } from "../AddWindow/AddSong";

export const AddWindow = ({ data }) => {
  const { currentUser } = useAuth();
  const [openAddSongWindow, setOpenAddSongWindow] = useState(false);
  const [currentSliderPage, setCurrentSliderPage] = useState(0);
  const sliderPages = [<AddSong />, <AddPlaylist />];
  return (currentUser.isAdmin || data.isAuthor) &&
    data.uid === currentUser.uid ? (
    <div className="AddSong">
      <button
        onClick={() => setOpenAddSongWindow(!openAddSongWindow)}
        style={openAddSongWindow ? { background: "var(--red)" } : {}}
        className="openAddSongWindowBtn"
      >
        <FiPlus
          style={openAddSongWindow ? { transform: "rotate(45deg)" } : {}}
        />
      </button>
      <div
        className="addSongWindow"
        style={openAddSongWindow ? { display: "flex" } : {}}
      >
        <Slider
          pages={["Song", "Playlist"]}
          currentPage={currentSliderPage}
          setCurrentPage={setCurrentSliderPage}
        />
        {sliderPages[currentSliderPage]}
      </div>
    </div>
  ) : null;
};
