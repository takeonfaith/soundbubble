import { firestore } from "../../../firebase";

const rankCurrentHint = (hintName, hintUid) => {
	if (hintName) {
		firestore
			.collection("search")
			.doc(hintUid)
			.get()
			.then((res) => {
				const rank = res.data().rank ? res.data().rank + 1 : 1;
				firestore
					.collection("search")
					.doc(hintUid)
					.update({
						rank: rank,
					});
			});
	}
};

export default rankCurrentHint