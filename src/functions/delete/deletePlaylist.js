import { firestore } from "../../firebase"

export const deletePlaylist = (playlistId) => {
	firestore.collection("users").where("addedPlaylists", "array-contains", playlistId).get().then((listOfPeople)=>{
		listOfPeople.docs.forEach(person=>{
			const personFilteredPlaylists = person.data().addedPlaylists.filter(pId => pId !== playlistId)
			firestore.collection('users').doc(person.data().uid).update({
				addedPlaylists:personFilteredPlaylists
			})
		})
	})
	firestore.collection("users").where("ownPlaylists", "array-contains", playlistId).get().then((listOfPeople)=>{
		listOfPeople.docs.forEach(person=>{
			const personFilteredPlaylists = person.data().addedPlaylists.filter(pId => pId !== playlistId)
			firestore.collection('users').doc(person.data().uid).update({
				ownPlaylists:personFilteredPlaylists
			})
		})
	})
	firestore.collection('search').doc(playlistId).delete().then(()=>{
		firestore.collection('playlists').doc(playlistId).delete()
	})
}