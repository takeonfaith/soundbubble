import { useAuth } from "../../../../contexts/AuthContext";
import { addSongToLibrary } from "../../../song/lib/add-song-to-library";
import { deleteSongFromLibrary } from "../../../../functions/other/deleteSongFromLibrary";
import { FiPlusCircle, FiX } from "react-icons/fi";
import { useSong } from "../../../../contexts/SongContext";
import { useModal } from "../../../../contexts/ModalContext";
export default function AddOrDeleteButtonFull({ song }) {
  const { currentUser } = useAuth();
  const { yourSongs } = useSong();
  const { openConfirm, setOpenModal } = useModal();
  if (!currentUser.addedSongs.includes(song.id)) {
    return (
      <span onClick={(e) => addSongToLibrary(e, song, currentUser)}>
        <FiPlusCircle />
        Add
      </span>
    );
  } else {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(false);
          openConfirm(
            "You sure you want to delete this song from library?",
            "Yes, delete it",
            "No, just kidding",
            (e) => deleteSongFromLibrary(e, song, currentUser, yourSongs)
          );
        }}
      >
        <FiX />
        Delete
      </span>
    );
  }
}
