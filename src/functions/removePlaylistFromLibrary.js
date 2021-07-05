import { firestore } from "../firebase"

export const removePlaylistFromLibrary = async (playlistData, currentUser) =>{
	const filteredPlaylists = currentUser.addedPlaylists.filter(id=>id !== playlistData.id)
	firestore.collection('users').doc(currentUser.uid).update({
		addedPlaylists:filteredPlaylists
	})
	firestore.collection('playlists').doc(playlistData.id).update({
		subscribers:--playlistData.subscribers
	})
}