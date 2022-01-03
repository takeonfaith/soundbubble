import { firestore } from "../../../firebase"

const parseHints = async (hint) => {
	const { place, uid, rank } = hint.data()
	const { name, authors, displayName, isVerified } = (await firestore.collection(place).doc(uid).get()).data() ?? {}
	return {
		type: place,
		name: name ? name : displayName,
		author: authors ? authors[0].displayName : null,
		uid: uid,
		rank: rank || 0,
		isVerified: isVerified ?? false
	}
}

const findSearchHints = async (searchValue, defaultSearchMode) => {
	if (searchValue.length > 0) {
		let hints;

		if (defaultSearchMode) {
			hints = (await firestore.collection('search')
				.where('variantsOfName', 'array-contains', searchValue).where('place', '==', defaultSearchMode).get())
				.docs.map(async (hint) => {
					return parseHints(hint)
				})
		}
		else {
			hints = (await firestore.collection('search')
				.where('variantsOfName', 'array-contains', searchValue).get())
				.docs.map(async (hint) => {
					return parseHints(hint)
				})
		}
		return hints
	}
	else return []
}

export default findSearchHints