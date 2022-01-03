import { firestore } from "../../firebase"

const fetchCollection = async (collection) => {
	const docs = (await firestore.collection(collection).get()).docs.map((doc) => doc.data())
	return docs
}

export default fetchCollection