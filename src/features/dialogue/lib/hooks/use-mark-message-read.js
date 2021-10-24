import { useEffect, useRef } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { firestore } from '../../../../firebase'
import useOnScreen from '../../../../hooks/useOnScreen'

const useMarkMessageRead = (chatId, messageData, otherMessages) => {
	const messageRef = useRef()
	const isVisible = useOnScreen(messageRef)
	const { currentUser } = useAuth()

	useEffect(() => {
		if (messageData.seenBy !== undefined) {
			if (currentUser.uid !== messageData.sender && isVisible) {
				if (!messageData.seenBy.includes(currentUser.uid)) {
					const tempMessages = otherMessages
					tempMessages[messageData.id].seenBy.push(currentUser.uid)
					firestore.collection('chats').doc(chatId).update({
						messages: tempMessages
					})
				}
			}
		}
	}, [isVisible])

	return [messageRef, isVisible]
}

export default useMarkMessageRead
