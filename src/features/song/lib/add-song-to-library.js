import { firestore } from "../../../firebase"

export const addSongToLibrary = (e, song, currentUser, setCurrentUser) => {
	e.stopPropagation()
	const songAuthorsUIDS = song.authors.map(author => author.uid)
	const finalAuthorsUIDS = []
	songAuthorsUIDS.forEach(authorId => {
		if (!currentUser.addedAuthors.includes(authorId)) {
			finalAuthorsUIDS.push(authorId)
		}
	})
	let newList = currentUser.addedSongs
	newList.push(song.id)
	firestore.collection('users').doc(currentUser.uid).update({
		addedSongs: newList,
		addedAuthors: [...finalAuthorsUIDS, ...currentUser.addedAuthors]
	})

	finalAuthorsUIDS.forEach(async authorId => {
		let subscribers = (await firestore.collection('users').doc(authorId).get()).data().subscribers
		subscribers++
		firestore.collection('users').doc(authorId).update({
			subscribers: subscribers
		})
	})
}