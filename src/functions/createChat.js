import { firestore } from "../firebase"
import getUID from "./getUID"

export const createChat = async (currentUserId, otherPersonId, chatUID = getUID()) => {
	firestore.collection('chats').doc(chatUID).set({
		chatImage:'',
		chatName:'',
		id:chatUID,
		messages:[],
		participants:[currentUserId, otherPersonId]
	})

	const currentUserChatsInfo = (await firestore.collection('users').doc(currentUserId).get()).data().chats
	const otherUserChatsInfo = (await firestore.collection('users').doc(otherPersonId).get()).data().chats
	currentUserChatsInfo.push(chatUID)
	otherUserChatsInfo.push(chatUID)

	firestore.collection('users').doc(currentUserId).update({
		chats:currentUserChatsInfo
	})

	firestore.collection('users').doc(otherPersonId).update({
		chats:otherUserChatsInfo
	})
}