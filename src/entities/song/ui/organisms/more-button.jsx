import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { SongItemMobileMoreWindow } from "../../../../features/mobile/ui/organisms/song-item-mobile-more-window";
import { useModal } from "../../../../contexts/modal";
import { Hint } from "../../../../shared/ui/atoms/hint";
import AddOrDeleteButton from "../molecules/add-or-delete-button";

const MoreButton = ({ song, isMobile, openSongItemMoreWindow }) => {
  const { toggleModal, setContent } = useModal();

  return (
    <div className="songItemMoreBtn">
      <AddOrDeleteButton song={song} />
      <button
        onClick={
          isMobile
            ? (e) => {
                e.stopPropagation();
                toggleModal();
                setContent(<SongItemMobileMoreWindow song={song} />);
              }
            : openSongItemMoreWindow
        }
      >
        <Hint text={"more"} />
        <FiMoreVertical />
      </button>
    </div>
  );
};

export default MoreButton;
