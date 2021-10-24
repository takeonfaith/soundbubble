import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import { useSong } from "../../../../contexts/SongContext";
import { deleteSongFromLibrary } from "../../../../functions/other/deleteSongFromLibrary";
import shortWord from "../../../../functions/other/shortWord";
import { addSongToLibrary } from "../add-song-to-library";

const useAddOrDeleteSong = (song) => {
	const { currentUser, setCurrentUser } = useAuth();
	const { yourSongs } = useSong();
	const { openBottomMessage, openConfirm, closeConfirm } = useModal();

	const addSong = (e) => {
		addSongToLibrary(e, song, currentUser, setCurrentUser);
		openBottomMessage(
			`${shortWord(song.name, 15)} added to your library`
		);
	}

	const removeSong = (e) => {
		e.stopPropagation();
		openConfirm(
			`You sure you want to delete "${song.name}" from library?`,
			"Yes, delete it",
			"No, just kidding",
			(e) => {
				deleteSongFromLibrary(e, song, currentUser, yourSongs);
				closeConfirm();
				openBottomMessage(
					`${shortWord(song.name, 15)} removed from your library`,
					"failure"
				);
			}
		);
	}

	return [addSong, removeSong]
}

export default useAddOrDeleteSong
