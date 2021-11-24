import { firestore } from "../../../firebase";
import filterArrayWithArray from "../../../shared/lib/filter-array-with-array";

const deleteAuthorFromLibrary = async (authorData, currentUser, yourSongs) => {
	/** 
		Эта функция находит все песни, которые не нужно удалять, руководствуясь двумя соображениями
		1. Песни, которые нужно удалить, содержат в качестве автора нужного нам
		2. Количество авторов у этих песен, на которых юзер подписан, должно быть больше двух, то есть
		чтобы нельзя было удалить треки, авторы которых все еще есть в библиотеке
	*/
	const songsNotToDelete = yourSongs.filter((song) => {
		return !song.authors.find((author) => author.uid === authorData.uid)
			|| currentUser.addedAuthors.length - filterArrayWithArray(currentUser.addedAuthors, song.authors.map((author) => author.uid)).length > 1
	})

	const filteredAuthors = currentUser.addedAuthors.filter((authorId) => authorId !== authorData.uid)
	const subscribersCount = (await firestore.collection('users').doc(authorData.uid).get()).data().subscribers

	firestore.collection('users').doc(currentUser.uid).update({
		addedSongs: songsNotToDelete.map((song) => song.id),
		addedAuthors: filteredAuthors
	})

	firestore.collection('users').doc(authorData.uid).update({
		subscribers: subscribersCount - 1
	})

}

export default deleteAuthorFromLibrary