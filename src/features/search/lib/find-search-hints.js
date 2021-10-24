import { firestore } from "../../../firebase"

const findSearchHints = async (searchValue) => {
	if (searchValue.length > 0) {
		const hints = (await firestore.collection('search')
			.where('variantsOfName', 'array-contains', searchValue).get())
			.docs.map(async (hint) => {
				const { place, uid, rank } = hint.data()
				const { name, authors, displayName, isVerified } = (await firestore.collection(place).doc(uid).get()).data()
				return {
					type: place,
					name: name ? name : displayName,
					author: authors ? authors[0].displayName : null,
					uid: uid,
					rank: rank || 0,
					isVerified: isVerified ?? false
				}
			})
		return hints
	}
	else return []
}

export default findSearchHints