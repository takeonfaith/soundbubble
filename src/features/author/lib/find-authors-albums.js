import { firestore } from "../../../firebase";

export const findAuthorsAlbums = async (authorsData, setAuthorsPlaylists, currentUserUID, setLoading) => {
	setAuthorsPlaylists([])
	const tempArray = []
	if (authorsData.ownPlaylists !== undefined && authorsData.ownPlaylists.length !== 0) {
		authorsData.ownPlaylists.forEach(async (playlistId, index) => {
			const playlistData = (await firestore.collection("playlists").doc(playlistId).get()).data()
			if (playlistData && (!playlistData.isPrivate || (authorsData.uid === currentUserUID && playlistData.isPrivate))) tempArray.push(playlistData)
			if (index === authorsData.ownPlaylists.length - 1) {
				tempArray.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
				setLoading(false)
				setAuthorsPlaylists(tempArray)
			}
		})

	}
}