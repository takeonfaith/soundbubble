import { firestore } from "../../../firebase"
import { sendMessage } from "../../../functions/other/sendMessage"

const leaveChat = async (chatId, user) => {
	const chatData = (await firestore.collection('chats').doc(chatId).get()).data()

	const newParticipants = chatData.participants.filter((participantId) => participantId !== user.uid)
	sendMessage(chatId, chatData, "soundbubble", `${user.displayName} left the chat`)
	firestore.collection('chats').doc(chatId).update({
		participants: newParticipants
	})
}

export default leaveChat