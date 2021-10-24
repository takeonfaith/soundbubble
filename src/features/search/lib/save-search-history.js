import { firestore } from "../../../firebase";

const saveSearchHistory = (uid, itemId, itemType) => {
	const newItemSaved = {
		id: itemId,
		type: itemType
	}
	firestore
		.collection("searchHistory")
		.doc(uid)
		.get()
		.then((res) => {
			if (res.data().history) {
				if (!res.data().history.find(({ id }) => id === itemId)) {
					firestore
						.collection("searchHistory")
						.doc(uid)
						.update({
							history: [newItemSaved, ...res.data().history.slice(0, 15)],
						});
				}
			} else {
				firestore
					.collection("searchHistory")
					.doc(uid)
					.set({
						history: [newItemSaved],
					});
			}
		});
};

export default saveSearchHistory