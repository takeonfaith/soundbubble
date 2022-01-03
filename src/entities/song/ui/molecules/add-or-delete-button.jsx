import React from "react";
import { FiPlusCircle, FiX } from "react-icons/fi";
import { useAuth } from "../../../../contexts/auth";
import { Hint } from "../../../../shared/ui/atoms/hint";
import useAddOrDeleteSong from "../../lib/hooks/use-add-or-delete-song";

const AddOrDeleteButton = ({ song }) => {
  const { currentUser } = useAuth();
  const [addSong, removeSong] = useAddOrDeleteSong(song);

  if (!currentUser.addedSongs.includes(song.id)) {
    return (
      <button onClick={addSong} style={{ position: "relative" }}>
        <Hint text={"add song"} />
        <FiPlusCircle />
      </button>
    );
  } else {
    return (
      <button onClick={removeSong} style={{ position: "relative" }}>
        <Hint text={"delete song"} />
        <FiX />
      </button>
    );
  }
};

export default AddOrDeleteButton;
