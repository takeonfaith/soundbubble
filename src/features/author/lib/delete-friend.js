import { firestore } from "../../../firebase"

export const deleteFriend = (currentUser, data) => {
	let filteredUserFriends = currentUser.friends.filter(friend => friend.uid !== data.uid)
	let filteredOtherUserFriends = data.friends.filter(friend => friend.uid !== currentUser.uid)

	firestore.collection('users').doc(currentUser.uid).update({
		friends: filteredUserFriends
	})

	firestore.collection('users').doc(data.uid).update({
		friends: filteredOtherUserFriends
	})
}