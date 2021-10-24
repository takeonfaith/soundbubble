import { firestore } from "../../../firebase"

const findTopSearches = async () => {
	const topSearches = (await firestore.collection('search')
		.orderBy("rank", "desc")
		.limit(10).get())
		.docs.map(async (search) => {
			const { place, uid, rank } = search.data()
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
	return topSearches
}

export default findTopSearches