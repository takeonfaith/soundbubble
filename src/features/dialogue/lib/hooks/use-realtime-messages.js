import { useEffect, useState } from 'react'
import { firestore } from '../../../../firebase'

/**
	  * Returns [chatData, messageList, loading, currentDateOnTop, findTopDate]
*/
export const useRealTimeMessages = (chatId, dateRefsArray) => {
	const [chatData, setChatData] = useState(null)
	const [messageList, setMessageList] = useState([])
	const [loading, setLoading] = useState(true)
	const [currentDateOnTop, setCurrentDateOnTop] = useState("")
	function findTopDate(e) {
		dateRefsArray.forEach(ref => {
			if (ref.current !== null) {
				if (ref.current.offsetTop - 20 <= e.target.scrollTop) setCurrentDateOnTop(ref.current.innerHTML)
			}
		})
	}

	useEffect(() => {
		const unsubscribe = firestore.collection('chats').doc(chatId)
			.onSnapshot(snapshot => {
				setChatData(snapshot.data())
				setMessageList(snapshot.data()?.messages)
				setCurrentDateOnTop(snapshot.data()?.messages.length ? snapshot.data().messages[snapshot.data().messages.length - 1].sentTime : new Date().toString())
				setLoading(false)
			})
		return () => {
			unsubscribe()
		}
	}, [chatId])


	return [chatData, messageList, loading, currentDateOnTop, findTopDate]
}
