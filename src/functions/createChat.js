import { firestore } from "../firebase"
import getUID from "./getUID"

export const createChat = async (admins, participants, chatUID = getUID(), chatName, chatImage) => {
	firestore.collection('chats').doc(chatUID).set({
		chatImage:chatImage,
		chatName:chatName,
		id:chatUID,
		messages:[],
		participants:participants,
		wallpaper:'undefined',
		admin:participants.length > 2? admins:undefined,
		fullySeenBy:[],
		typing:[]
	})

	participants.map(async personId=>{
		let chatInfo = (await firestore.collection('users').doc(personId).get()).data().chats
		chatInfo.push(chatUID)
		firestore.collection('users').doc(personId).update({
			chats:chatInfo
		})
	})
}