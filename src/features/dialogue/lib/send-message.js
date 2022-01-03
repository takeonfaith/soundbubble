import { firestore } from "../../../firebase"

export const sendMessage = (chatId, chatData, sender, messageText, attachedSongs = [], attachedAlbums = [], attachedAuthors = [], inResponseToMessage) => {
	if (messageText.trim().length !== 0 || attachedSongs.length !== 0 || attachedAlbums.length !== 0 || attachedAuthors.length !== 0) {
		const tempMessages = chatData?.messages || []

		tempMessages.push({
			id: tempMessages.length,
			sender: sender,
			message: messageText,
			sentTime: new Date().toString(),
			inResponseToMessage: inResponseToMessage || null,
			attachedSongs: attachedSongs,
			attachedAlbums: attachedAlbums,
			attachedAuthors: attachedAuthors,
			seenBy: [sender]
		})

		firestore.collection('chats').doc(chatId).update({
			messages: tempMessages
		})
	}
}