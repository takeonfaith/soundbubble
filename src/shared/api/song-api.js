import { firestore } from "../../firebase"

export const getSongById = async (songId) => {
	const data = (await firestore.collection('songs').doc(songId).get()).data()
	return data
}