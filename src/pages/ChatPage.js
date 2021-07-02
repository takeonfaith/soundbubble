import React, { useState } from 'react'
import { ChatItem } from '../components/ChatPage/ChatItem'
import { useAuth } from '../functionality/AuthContext'
import { LoadingCircle } from '../components/Basic/LoadingCircle'
import '../styles/ChatPage.css'
import { ModalWindow } from '../components/Basic/ModalWindow'
import { useFetchFirebaseData } from '../hooks/fetchFirebaseData'
import {FiPlus} from 'react-icons/fi'
import { useModal } from '../functionality/ModalClass'
import {CreateChat} from '../components/ChatPage/CreateChat'
export const ChatPage = () => {
	const [yourChats, setYourChats] = useState([])
	const {toggleModal, setContent} = useModal()
	const { currentUser } = useAuth()
	const [loading, setLoading] = useState(true)
	const [searchValue, setSearchValue] = useState("")
	useFetchFirebaseData(setLoading, 'chats', currentUser.chats, setYourChats, (a, b)=>{if(b.messages.length && a.messages.length) return new Date(b.messages[b.messages.length - 1].sentTime).getTime() - new Date(a.messages[a.messages.length - 1].sentTime).getTime()})

	return (
		<div style={{ animation: 'zoomIn .2s forwards', minHeight: "100%" }}>
			<div style = {{marginBottom:'10px', display:'flex', alignItems:'start', width:'100%'}}>

				<button className = "standartButton" onClick = {()=>{toggleModal();setContent(<CreateChat/>)}}>
					<FiPlus/>
					Create chat
				</button>
			</div>
			{loading ?
				<LoadingCircle />
				:
				<div className="chatsWrapper">
					{yourChats.map((chat, index) => {
						console.log(chat)
						return <ChatItem chatData={chat} key={index} />
					})}
				</div>
			}

		</div>
	)
}
