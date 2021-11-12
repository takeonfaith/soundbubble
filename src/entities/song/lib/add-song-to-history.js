import { firestore } from "../../../firebase"

export const addSongToHistory = (songId, currentUser) => {
	firestore.collection('history').doc(currentUser.uid).get().then(res => {
		const songsList = res.data().history
		if (songsList[0] !== songId) songsList.unshift(songId)
		if (songsList.length > 30) songsList.length = 30

		firestore.collection('history').doc(currentUser.uid).update({
			history: songsList
		})
	})
}