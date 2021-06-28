import { firestore } from "../firebase"

export const sendMessage = (chatId, chatData, sender, messageText, attachedSongs = [], attachedAlbums = [], attachedAuthors = [], inResponseToMessage) => {
	if (messageText.length !== 0 || attachedSongs.length !== 0) {
		const tempMessages = chatData.messages

		tempMessages.push({
			id: chatData.messages.length,
			sender: sender,
			message: messageText,
			sentTime: new Date().toString(),
			inResponseToMessage: inResponseToMessage || null,
			attachedSongs: attachedSongs,
			attachedAlbums: [],
			attachedAuthors: [],
		})

		firestore.collection('chats').doc(chatId).update({
			messages: tempMessages
		})
	}
}