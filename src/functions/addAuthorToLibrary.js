import { firestore } from "../firebase"

export const addAuthorToLibrary = async (authorData , currentUser) => {
	const addedAuthors = (await firestore.collection('users').doc(currentUser.uid).get()).data().addedAuthors
	addedAuthors.push(authorData.uid)
	firestore.collection('users').doc(currentUser.uid).update({
		addedAuthors: addedAuthors
	})
	let subscribers = authorData.subscribers
	subscribers++
	firestore.collection('users').doc(authorData.uid).update({
		subscribers: subscribers
	})
}