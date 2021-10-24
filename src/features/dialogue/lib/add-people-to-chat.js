import { firestore } from "../../../firebase"
import { sendMessage } from "../../../functions/other/sendMessage"

const addPeopleToChat = async (chatId, people, setLoading, setCompleted) => {
	setLoading(true)
	setCompleted(false)
	const chatData = (await firestore.collection('chats').doc(chatId).get()).data()
	const newParticipants = chatData.participants
	people.forEach(person => newParticipants.push(person.uid));

	firestore.collection('chats').doc(chatId).update({
		participants: newParticipants
	})
	sendMessage(chatId, chatData, "soundbubble", `${people.map(({ displayName }) => displayName)} entered the chat`)
	setLoading(false)
	setCompleted(true)
}

export default addPeopleToChat