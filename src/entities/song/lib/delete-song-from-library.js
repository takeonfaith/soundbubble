import { firestore } from "../../../firebase"
import filterArrayWithArray from "../../../shared/lib/filter-array-with-array"

export const deleteSongFromLibrary = (e, song, currentUser, yourSongs) => {
	e.stopPropagation()
	const songAuthorsUIDS = song.authors.map(author => author.uid)
	const finalAuthorsUIDS = [] // массив авторов, песни которых еще остались после удаления выбранной песни
	let newList = currentUser.addedSongs.filter(songNum => songNum !== song.id)
	songAuthorsUIDS.forEach(authorId => {
		yourSongs.forEach(songObj => {
			if (newList.includes(songObj.id) && songObj.authors.find(a => a.uid === authorId)) {
				finalAuthorsUIDS.push(authorId)
			}
		});
	});
	const filtered = filterArrayWithArray(songAuthorsUIDS, finalAuthorsUIDS) // массив людей, которых нужно убрать из библиотеки
	const finalFilteredAuthors = filterArrayWithArray(currentUser.addedAuthors, filtered) // массив людей, оставшихся в библиотеке

	firestore.collection('users').doc(currentUser.uid).update({
		addedSongs: newList,
		addedAuthors: finalFilteredAuthors
	})

	filtered.forEach(async authorId => {
		let subscribers = (await firestore.collection('users').doc(authorId).get()).data().subscribers
		subscribers--
		firestore.collection('users').doc(authorId).update({
			subscribers: subscribers
		})
	})

}