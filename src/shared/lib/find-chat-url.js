import { firestore } from "../../firebase"
import getUID from "./get-uid"


export const findChatURL = async (allParticipants, currentUser, setShouldCreate, setFriendChatId) => {
	let foundChat = false
	let chatId = 0
	if (currentUser.chats) {
		// Принцип работы таков: он ищет все чаты, в которых есть юзер. Затем он проходит по ним. Затем он проходит по выбранным друзьям
		// Если он находит, что друг есть в списке участников чата, добавляет к count 1, если нет, сразу выходит из цикла учатсников
		// После завершения цикла он проверяет, если количество совпадений + 1 (потому что в массив друзей не входит сам пользователь) равно
		// длине конкретного чата и если количество совпадений равно длине поступившего изначально массива участников, тогда нужный чат найден
		const chatsWhereUserIn = await firestore.collection('chats').where('participants', 'array-contains', currentUser.uid).get()
		chatsWhereUserIn.docs.forEach(chat => {
			let count = 0
			allParticipants.every(personId => {
				if (chat.data().participants.includes(personId)) {
					count++
					return true
				}
				else return false
			})
			if (count + 1 === chat.data().participants.length && count === allParticipants.length) {
				foundChat = true
				setShouldCreate(false)
				setFriendChatId(chat.data().id)
				chatId = chat.data().id
				return false
			}
			else return true
		})

		if (!foundChat) {
			const random = getUID()
			foundChat = true
			setShouldCreate(true)
			setFriendChatId(random)
			chatId = random
		}
		return chatId
	}
}