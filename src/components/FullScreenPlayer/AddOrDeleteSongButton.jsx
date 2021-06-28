import { useAuth } from "../../functionality/AuthContext"
import { addSongToLibrary } from "../../functions/addSongToLibrary"
import { deleteSongFromLibrary } from "../../functions/deleteSongFromLibrary"
import {FiPlusCircle, FiTrash2} from 'react-icons/fi'
import { useSong } from "../../functionality/SongPlay/SongContext"
export default function AddOrDeleteButtonFull({song}) {
	const {currentUser} = useAuth()
	const {yourSongs} = useSong()
	if (!currentUser.addedSongs.includes(song.id)) {
		return <span onClick={(e) => addSongToLibrary(e, song, currentUser)}>
			<FiPlusCircle />
			Add
		</span>
	}
	else {
		return <span onClick={(e) => deleteSongFromLibrary(e, song, currentUser, yourSongs)}>
			<FiTrash2 />
			Delete
		</span>
	}
}