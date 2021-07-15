import { firestore } from "../../firebase";
import { createChat } from "../create/createChat";
import { findChatURL } from "../find/findChatURL";
import getUID from "./getUID";
import { sendMessage } from "./sendMessage";

export default function shareWithFriends(shareList, currentUser, itemId, whatToShare, messageText = "") {
	//Сделать через функцию sendMessage
	shareList.map(async userId => {
		//Сортировка по последнему отправлению
		const sortedFriends = [{uid:userId, status:'added'}, ...currentUser.friends.filter(obj => obj.uid !== userId)]
		firestore.collection('users').doc(currentUser.uid).update({
			friends:sortedFriends
		})
		Promise.resolve(findChatURL([userId], currentUser, () => null, () => null)).then(async chatId => {
			let chatData = (await firestore.collection('chats').doc(chatId).get()).data()
			console.log(chatId, chatData)
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
				const chatUID = getUID()
				createChat([currentUser.uid, userId], chatUID).then(async () => {
					chatData = (await firestore.collection('chats').doc(chatUID).get()).data()
					switch (whatToShare) {
						case "song":
							sendMessage(chatUID, chatData, currentUser.uid, messageText, [itemId])
							break;
						case "playlist":
							sendMessage(chatUID, chatData, currentUser.uid, messageText, [], [itemId])
							break;
						case "author":
							sendMessage(chatUID, chatData, currentUser.uid, messageText, [], [], [itemId])
							break;
						default:
							sendMessage(chatUID, chatData, currentUser.uid, messageText, [itemId])
							break;
					}
				})
			}
		})
	})


}