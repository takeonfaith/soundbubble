import React from "react";
import { FiCheck, FiPlusCircle } from "react-icons/fi";
import { useAddOrDeleteSong } from "../../../../entities/playlist/lib/hooks/use-add-or-delete-song";
import { Hint } from "../../../../shared/ui/atoms/hint";

export const AddToPlaylistItem = ({ playlist, song }) => {
  const [addFunc, isAdded] = useAddOrDeleteSong(playlist.id, song.id);
  return (
    <div className="songItemMenuWindowItem" onClick={addFunc}>
      {!isAdded ? (
        <>
          <Hint text={`Add "${song.name}" to playlist`} />
          <FiPlusCircle />
        </>
      ) : (
        <>
          <Hint text={`Remove ${song.name} from playlist`} />
          <FiCheck />
        </>
      )}
      {playlist.name}
    </div>
  );
};
