import { firestore } from "../firebase";
import { findChatURL } from "./findChatURL";

export default function shareWithFriends(shareList, currentUser, itemId, whatToShare, messageText = "") {
	console.log(whatToShare)
	shareList.map(async userId=>{
		const chatId = findChatURL(userId, currentUser, ()=>null, ()=>null)
		chatId.then(async (res)=>{
			const chatData = (await firestore.collection('chats').doc(res).get()).data()
			switch(whatToShare){
				case "song":
					chatData.messages.push({
						id: chatData.messages.length,
						sender: currentUser.uid,
						message: messageText,
						sentTime: new Date(),
						inResponseToMessage: null,
						attachedSongs: [itemId],
						attachedAlbums: [],
						attachedAuthors: [],
					})
					break;
				case "playlist":
					chatData.messages.push({
						id: chatData.messages.length,
						sender: currentUser.uid,
						message: messageText,
						sentTime: new Date(),
						inResponseToMessage: null,
						attachedSongs: [],
						attachedAlbums: [itemId],
						attachedAuthors: [],
					})
					break;
				case "author":
					chatData.messages.push({
						id: chatData.messages.length,
						sender: currentUser.uid,
						message: messageText,
						sentTime: new Date(),
						inResponseToMessage: null,
						attachedSongs: [],
						attachedAlbums: [],
						attachedAuthors: [itemId],
					})
					break;
					
				default:
					chatData.messages.push({
						id: chatData.messages.length,
						sender: currentUser.uid,
						message: messageText,
						sentTime: new Date(),
						inResponseToMessage: null,
						attachedSongs: [itemId],
						attachedAlbums: [],
						attachedAuthors: [],
					})
					break;
			}
	
			firestore.collection('chats').doc(res).update({
				messages: chatData.messages
			})
		})
	})

	
}