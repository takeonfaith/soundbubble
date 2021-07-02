import { firestore } from "../firebase";
import { createChat } from "./createChat";
import { findChatURL } from "./findChatURL";
import getUID from "./getUID";

export default function shareWithFriends(shareList, currentUser, itemId, whatToShare, messageText = "") {

	shareList.map(async userId=>{
		const chatId = findChatURL(userId, currentUser, ()=>null, ()=>null)
		chatId.then(async (res)=>{
			let chatData = (await firestore.collection('chats').doc(res).get()).data()
			if(chatData !== undefined){
				switch(whatToShare){
					case "song":
						chatData.messages.push({
							id: chatData.messages.length,
							sender: currentUser.uid,
							message: messageText,
							sentTime: new Date().toString(),
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
							sentTime: new Date().toString(),
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
							sentTime: new Date().toString(),
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
							sentTime: new Date().toString(),
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
			}
			else{
				const chatUID = getUID()
				createChat([currentUser.uid, userId], chatUID).then(async ()=>{
					chatData = (await firestore.collection('chats').doc(chatUID).get()).data()
					switch(whatToShare){
						case "song":
							chatData.messages.push({
								id: chatData.messages.length,
								sender: currentUser.uid,
								message: messageText,
								sentTime: new Date().toString(),
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
								sentTime: new Date().toString(),
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
								sentTime: new Date().toString(),
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
								sentTime: new Date().toString(),
								inResponseToMessage: null,
								attachedSongs: [itemId],
								attachedAlbums: [],
								attachedAuthors: [],
							})
							break;
					}

					firestore.collection('chats').doc(chatUID).update({
						messages: chatData.messages
					})
				})
			}
	
			
		})
	})

	
}