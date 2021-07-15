import { firestore } from "../../firebase"

export default function addFriend(friendData, currentUser){
	const updatedDataForFriend = friendData.friends
	const updatedDataForCurrentUser = currentUser.friends
	updatedDataForFriend.push({status:'requested', uid:currentUser.uid})
	updatedDataForCurrentUser.push({status:'awaiting', uid:friendData.uid})

	firestore.collection('users').doc(friendData.uid).update({
		friends:updatedDataForFriend
	})

	firestore.collection('users').doc(currentUser.uid).update({
		friends:updatedDataForCurrentUser
	})

}