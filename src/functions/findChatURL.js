import { firestore } from "../firebase"
import getUID from "./getUID"

export const  findChatURL = async(friendId, currentUser, setShouldCreate, setFriendChatId) => {
	let foundChat = false
	let chatId = 0
	if (currentUser.chats) {
		const chatInfo = (await firestore.collection('chats').where('participants', "==", [friendId, currentUser.uid]).get())
		const chatInfo2 = (await firestore.collection('chats').where('participants', "==", [currentUser.uid, friendId]).get())
		chatInfo.docs.forEach(chat=>{
			foundChat = true
			setShouldCreate(false)
			setFriendChatId(chat.data().id)
			chatId = chat.data().id
			console.log(chat.data().id)
		})
		chatInfo2.docs.forEach(chat=>{
			foundChat = true
			setShouldCreate(false)
			setFriendChatId(chat.data().id)
			chatId = chat.data().id
			console.log(chat.data().id)
		})
		
		if(!foundChat){
			const random = getUID()
			foundChat = true
			console.log('what am i doing here?')
			setShouldCreate(true)
			setFriendChatId(random)
			chatId = random
		}

		return chatId
	}
}