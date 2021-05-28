import { firestore } from "../firebase";
import { useAuth } from "../functionality/AuthContext";

export default function shareWithFriends(shareList, currentUser, songId) {
	// Object.keys(chat).forEach((chatId, index) => {
	// 	shareList.map((friend) => {
	// 		if (chat[chatId].participants.includes(friend.id) && chat[chatId].participants.includes(30)) {
	// 			chat[chatId].messages.push(
	// 				{
	// 					id: chat[chatId].messages.length,
	// 					sender: 30,
	// 					message: '',
	// 					sentTime:new Date(),
	// 					inResponseToMessage: null,
	// 					attachedSongs: [currentSong],
	// 					attachedAlbums: [],
	// 					attachedAuthors: [],
	// 				}
	// 			)
	// 		}
	// 	})
	// })
	// setShareWithWhom([])
	console.log(songId)
	shareList.map(async userId=>{
		console.log(userId)
		const chatResponse = firestore.collection('chats').where('participants', '==', [currentUser.uid, userId]) || firestore.collection('chats').where('participants', '==', [userId, currentUser.uid])
		const chatData = await (await chatResponse.get()).docs[0].data()
		const chatId = chatData.id
		chatData.messages.push({
			id: chatData.messages.length,
			sender: currentUser.uid,
			message: '',
			sentTime: new Date(),
			inResponseToMessage: null,
			attachedSongs: [songId],
			attachedAlbums: [],
			attachedAuthors: [],
		})
		console.log(chatId)
		console.log(chatData.messages)
		firestore.collection('chats').doc(chatId).update({
			messages: chatData.messages
		})
	})

	
}