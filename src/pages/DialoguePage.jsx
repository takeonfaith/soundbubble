import React from 'react'
import { useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { ChatHeader } from '../components/ChatPage/ChatHeader'
import { ChatInput } from '../components/AuthorPage/ChatInput'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LoadingCircle } from '../components/Loading/LoadingCircle'
import { DateOnTop } from '../components/ChatPage/DateOnTop'
import { useRealTimeMessages } from '../hooks/useRealTimeMessages'
import { ChatMessagesWindow } from '../components/ChatPage/ChatMessagesWindow'
import { useScreen } from '../contexts/ScreenContext'
export const DialoguePage = () => {
	const match = useRouteMatch('/chat/:chatId')
	const {screenHeight} = useScreen()
	const { currentUser } = useAuth()
	const { chatId } = match.params
	const [messageText, setMessageText] = useState("")
	const [inResponseToMessage, setInResponseToMessage] = useState([])
	const [dateRefsArray, setDateRefsArray] = useState([])
	const history = useHistory()
	const [chatData, messageList, loading, currentDateOnTop, findTopDate] = useRealTimeMessages(chatId, dateRefsArray)
	
	useEffect(() => {
		if (chatData.participants !== undefined) {
			if (!chatData.participants.includes(currentUser.uid)) history.push('/chat')
		}
	}, [chatData])

	return (
		<div className="DialoguePage" style = {{height:'100%'}}>
			{
				loading ?
					<LoadingCircle top = {"50%"}/> :
					<>
						<ChatHeader data={chatData} />
						<DateOnTop date = {currentDateOnTop}/>
						<ChatMessagesWindow chatId = {chatId} chatData = {chatData} messageList = {messageList} findTopDate = {findTopDate} setDateRefsArray = {setDateRefsArray} inResponseToMessage = {inResponseToMessage} setInResponseToMessage = {setInResponseToMessage}/>
						<ChatInput 
							chatId={chatId} 
							chatData = {chatData}
							messageText={messageText} 
							setMessageText={setMessageText} 
							inResponseToMessage = {inResponseToMessage} 
							setInResponseToMessage = {setInResponseToMessage} 
							otherMessages = {messageList}
						/>
					</>
			}
			{chatData.wallpaper !== "undefined"?<img loading = "lazy" src={chatData.wallpaper} className = "chatWallpaper" alt=""/>:null}
		</div>
	)
}
