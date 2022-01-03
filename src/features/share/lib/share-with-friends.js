import { firestore } from "../../../firebase";
import { createChat } from "../../../shared/lib/create-сhat";
import { findChatURL } from "../../../shared/lib/find-chat-url";
import { sendMessage } from "../../dialogue/lib/send-message";

export default function shareWithFriends({ shareList, currentUser, itemId, whatToShare, messageText = "", setShouldCreate = () => null, setFriendChatId = () => null, setLoading = () => null, setCompleted = () => null }) {
	setLoading(true)
	setCompleted(false)
	//Сделать через функцию sendMessage
	shareList.map(async userId => {
		//Сортировка по последнему отправлению
		const sortedFriends = [{ uid: userId, status: 'added' }, ...currentUser.friends.filter(obj => obj.uid !== userId)]
		firestore.collection('users').doc(currentUser.uid).update({
			friends: sortedFriends
		})
		Promise.resolve(findChatURL([userId], currentUser, () => null, setFriendChatId)).then(async chatId => {
			let chatData = (await firestore.collection('chats').doc(chatId).get()).data()
			if (chatData !== undefined) {
				switch (whatToShare) {
					case "song":
						sendMessage(chatId, chatData, currentUser.uid, messageText, [itemId])
						break;
					case "playlist":
						sendMessage(chatId, chatData, currentUser.uid, messageText, [], [itemId])
						break;
					case "author":
						sendMessage(chatId, chatData, currentUser.uid, messageText, [], [], [itemId])
						break;
					default:
						sendMessage(chatId, chatData, currentUser.uid, messageText, [itemId])
						break;
				}
			}
			else {
				createChat([currentUser.uid, userId], chatId).then(async () => {
					chatData = (await firestore.collection('chats').doc(chatId).get()).data()
					setShouldCreate(false)
					switch (whatToShare) {
						case "song":
							sendMessage(chatId, chatData, currentUser.uid, messageText, [itemId])
							break;
						case "playlist":
							sendMessage(chatId, chatData, currentUser.uid, messageText, [], [itemId])
							break;
						case "author":
							sendMessage(chatId, chatData, currentUser.uid, messageText, [], [], [itemId])
							break;
						default:
							sendMessage(chatId, chatData, currentUser.uid, messageText, [itemId])
							break;
					}
				})
			}
		}).then(() => {
			setLoading(false)
			setCompleted(true)
		})
	})


}