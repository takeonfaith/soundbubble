import React, { useEffect, useState } from 'react'
import { ChatItem } from '../components/ChatPage/ChatItem'
import { chat } from '../data/chat'
import { firestore } from '../firebase'
import { useAuth } from '../functionality/AuthContext'
import { LoadingCircle } from '../components/Basic/LoadingCircle'
import '../styles/ChatPage.css'
import { ModalWindow } from '../components/Basic/ModalWindow'
export const ChatPage = () => {
	const [yourChats, setYourChats] = useState([])
	const { currentUser } = useAuth()
	const [loading, setLoading] = useState(true)

	function fetchYourChats() {
		const tempArray = []
		currentUser.chats.forEach(async (chatId, index) => {
			const chats = (await firestore.collection('chats').doc(chatId).get()).data()
			setLoading(false)
			tempArray.push(chats)
			if(index === currentUser.chats.length - 1){
				tempArray.sort((a, b)=>{return new Date(b.messages[b.messages.length - 1].sentTime).getTime() - new Date(a.messages[a.messages.length - 1].sentTime).getTime()})
				setYourChats(tempArray)
			}
		})
	}



	useEffect(() => {
		fetchYourChats()

	}, [])
	return (
		<div style={{ animation: 'zoomIn .2s forwards', minHeight: "100%" }}>
			{loading ?
				<LoadingCircle />
				:
				<div className="chatsWrapper">
					{yourChats.map((chat, index) => {
						return <ChatItem chatData={chat} key={index} />
					})}
				</div>
			}

		</div>
	)
}
