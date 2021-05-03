import React from 'react'
import { ChatItem } from '../components/ChatPage/ChatItem'
import { chat } from '../data/chat'
import '../styles/ChatPage.css'
export const ChatPage = () => {
	return (
		<div style = {{animation:'zoomIn .2s forwards'}}>
			<div className = "chatsWrapper">
				{Object.keys(chat).map((chatId, index)=>{
					if(chat[chatId].participants.includes(30)){
						return (
							<ChatItem participantsIds = {chat[chatId].participants} chatId = {chatId} key = {index}/>
						)
					}
				})}
			</div>
		</div>
	)
}
