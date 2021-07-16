import React, { useEffect, useState } from 'react'
import { ChatItem } from '../components/ChatPage/ChatItem'
import { useAuth } from '../contexts/AuthContext'
import { LoadingCircle } from '../components/Loading/LoadingCircle'
import '../styles/ChatPage.css'
import {FiPlus} from 'react-icons/fi'
import { useModal } from '../contexts/ModalContext'
import {CreateChat} from '../components/ChatPage/CreateChat'
import { fetchItemsList } from '../functions/fetch/fetchItemsList'
export const ChatPage = () => {
	const [yourChats, setYourChats] = useState([])
	const {toggleModal, setContent} = useModal()
	const { currentUser } = useAuth()
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		fetchItemsList(currentUser.chats, 'chats', setYourChats, (res)=>res.sort((a, b)=>new Date(b.messages[b.messages.length - 1].sentTime).getTime() - new Date(a.messages[a.messages.length - 1].sentTime).getTime()), ()=>setLoading(false))
	}, [])
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
					{yourChats.length? yourChats.map((chat, index) => {
						return <ChatItem chatData={chat} key={index} />
					}):<h3>No chats</h3>}
				</div>
			}

		</div>
	)
}
