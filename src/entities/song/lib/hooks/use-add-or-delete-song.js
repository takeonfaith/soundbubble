import { useAuth } from "../../../../contexts/auth";
import { useModal } from "../../../../contexts/modal";
import { useSong } from "../../../../contexts/song";
import getShortString from "../../../../shared/lib/get-short-string";
import { addSongToLibrary } from "../add-song-to-library";
import { deleteSongFromLibrary } from "../delete-song-from-library";

const useAddOrDeleteSong = (song) => {
	const { currentUser, setCurrentUser } = useAuth();
	const { yourSongs } = useSong();
	const { openBottomMessage, openConfirm, closeConfirm } = useModal();

	const addSong = (e) => {
		addSongToLibrary(e, song, currentUser, setCurrentUser);
		openBottomMessage(
			`${getShortString(song.name, 15)} added to your library`
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
					`${getShortString(song.name, 15)} removed from your library`,
					"failure"
				);
			}
		);
	}

	return [addSong, removeSong]
}

export default useAddOrDeleteSong
