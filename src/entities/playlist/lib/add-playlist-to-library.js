import { firestore } from "../../../firebase"

export const addPlaylistToLibrary = async (playlistData, currentUser) => {
	const addedPlaylists = (await firestore.collection('users').doc(currentUser.uid).get()).data().addedPlaylists
	addedPlaylists.push(playlistData.id)
	firestore.collection('users').doc(currentUser.uid).update({
		addedPlaylists: addedPlaylists
	})

	firestore.collection('playlists').doc(playlistData.id).update({
		subscribers: ++playlistData.subscribers
	})
}