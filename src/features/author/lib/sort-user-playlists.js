import { firestore } from "../../../firebase"

const sortUserPlaylists = (playlist, currentUser) => {
	const sortedPlaylists = [playlist.id, ...currentUser.ownPlaylists.filter(id => id !== playlist.id)]
	if (playlist.isAlbum) {
		if (currentUser.addedPlaylists.includes(playlist.id)) {
			firestore.collection('users').doc(currentUser.uid).update({
				addedPlaylists: sortedPlaylists
			})
		}
		return
	}

	if (currentUser.ownPlaylists.includes(playlist.id)) {
		firestore.collection('users').doc(currentUser.uid).update({
			ownPlaylists: sortedPlaylists
		})
	}
}

export default sortUserPlaylists
