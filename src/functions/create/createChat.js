import { firestore } from "../../firebase"
import getUID from "../other/getUID"

export const createChat = async ( participants, chatUID = getUID(), chatName = "", chatImage = "", admins = [], imageColors = []) => {
	firestore.collection('chats').doc(chatUID).set({
		chatImage:chatImage,
		chatName:chatName,
		id:chatUID,
		messages:[],
		participants:participants,
		wallpaper:'undefined',
		admins:participants.length > 2? admins:[],
		typing:[],
		imageColors:imageColors
	})

	participants.map(async personId=>{
		let chatInfo = (await firestore.collection('users').doc(personId).get()).data().chats
		chatInfo.push(chatUID)
		firestore.collection('users').doc(personId).update({
			chats:chatInfo
		})
	})
}