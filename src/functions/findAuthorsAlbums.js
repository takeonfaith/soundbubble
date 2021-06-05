import { firestore } from "../firebase";

export const findAuthorsAlbums = async(authorsData, setAuthorsPlaylists, currentUserUID, setLoading) => {
	setAuthorsPlaylists([])
	const tempArray = []
	if(authorsData.ownPlaylists !== undefined && authorsData.ownPlaylists.length !== 0){
		const response = authorsData.uid === currentUserUID?firestore.collection("playlists")
			.where("id", "in", authorsData.ownPlaylists):
			firestore.collection("playlists")
			.where("id", "in", authorsData.ownPlaylists).where('isPrivate', '==', false)
		const data = await response.get();
		data.docs.forEach(item => {
			tempArray.push(item.data())
		})
	}
	tempArray.sort((a, b)=> new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
	setLoading(false)
	setAuthorsPlaylists(tempArray)
}