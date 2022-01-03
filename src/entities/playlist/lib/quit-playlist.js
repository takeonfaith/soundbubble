import { firestore } from "../../../firebase"

export const quitPlaylist = (playlist, currentUser) => {
	//logic for quiting playlist where it has more than one participant
	firestore.collection('users').doc(currentUser.uid).update({
		ownPlaylists: currentUser.ownPlaylists.filter(id => id !== playlist.id)
	})
	firestore.collection('playlists').doc(playlist.id).update({
		authors: playlist.authors.filter(author => author.uid !== currentUser.uid)
	})
}