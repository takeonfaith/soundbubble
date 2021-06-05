import { firestore } from "../firebase"
import getUID from "./getUID"

export const createChat = async (currentUserId, otherPersonId, uid = getUID()) => {
	firestore.collection('chats').doc(uid).set({
		chatImage:'',
		chatName:'',
		id:uid,
		messages:[],
		participants:[currentUserId, otherPersonId]
	})

	const currentUserChatsInfo = (await firestore.collection('users').doc(currentUserId).get()).data().chats
	const otherUserChatsInfo = (await firestore.collection('users').doc(otherPersonId).get()).data().chats
	currentUserChatsInfo.push(uid)
	otherUserChatsInfo.push(uid)

	firestore.collection('users').doc(currentUserId).update({
		chats:currentUserChatsInfo
	})

	firestore.collection('users').doc(otherPersonId).update({
		chats:otherUserChatsInfo
	})
}