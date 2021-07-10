import React, { createRef } from 'react'
import { useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { ChatHeader } from '../components/ChatPage/ChatHeader'
import { MessageItem } from '../components/ChatPage/MessageItem'
import { DisplayChatMessages } from '../components/ChatPage/DisplayChatMessages'
import { useRef } from 'react'
import { ChatInput } from '../components/AuthorPage/ChatInput'
import { useEffect } from 'react'
import { firestore } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { LoadingCircle } from '../components/Basic/LoadingCircle'
import displayDate from '../functions/displayDate'
import { DateOnTop } from '../components/ChatPage/DateOnTop'
import { TypingAnimation } from '../components/ChatPage/TypingAnimation'
import { useScreen } from '../contexts/ScreenContext'
export const DialoguePage = () => {
	const match = useRouteMatch('/chat/:chatId')
	const { currentUser } = useAuth()
	const { chatId } = match.params
	const [messageText, setMessageText] = useState("")
	const [chatData, setChatData] = useState([])
	const scrollToBottomElementRef = useRef(null)
	const messagesWindowRef = useRef(null)
	const {screenHeight} = useScreen()

	const [loading, setLoading] = useState(true)

	const [messageList, setMessageList] = useState([])
	const [inResponseToMessage, setInResponseToMessage] = useState([])
	const [currentDateOnTop, setCurrentDateOnTop] = useState("")
	const [dateRefsArray, setDateRefsArray] = useState([])
	const history = useHistory()
	const scrollToMyRef = () => {
		const scroll = messagesWindowRef.current.scrollHeight - messagesWindowRef.current.clientHeight;
		messagesWindowRef.current.scrollTo(0, scroll);
	};
	useEffect(() => {
		const unsubscribe = firestore.collection('chats').doc(chatId)
			.onSnapshot(snapshot => {
				setChatData(snapshot.data())
				setMessageList(snapshot.data().messages)
				
				setCurrentDateOnTop(snapshot.data().messages.length?snapshot.data().messages[0].sentTime:new Date().toString())
				setLoading(false)
			})
		return () => {
			unsubscribe()
		}
	}, [firestore, chatId])



	useEffect(() => {
		if (chatData.participants !== undefined) {
			if (!chatData.participants.includes(currentUser.uid)) history.push('/chat')
		}
	}, [chatData])

	useEffect(() => {
		if (messagesWindowRef.current !== null && messageList.length > 0) scrollToMyRef()
	}, [messageList])

	function findTopDate(e){
		dateRefsArray.forEach(ref=>{
			if(ref.current !== null) {
				if(ref.current.offsetTop - 70 <= e.target.scrollTop) setCurrentDateOnTop(ref.current.innerHTML)
			}
		})
	}

	return (
		<div className="DialoguePage">
			{
				loading ?
					<LoadingCircle /> :
					<>
						<ChatHeader data={chatData} />
						<DateOnTop date = {currentDateOnTop}/>
						<div className="chatMessagesWindow" ref={messagesWindowRef} onScroll = {findTopDate} style = {{height:screenHeight-170 + 'px'}}>
							<DisplayChatMessages chatId = {chatId} messageList = {messageList} inResponseToMessage = {inResponseToMessage} setInResponseToMessage = {setInResponseToMessage} messagesWindowRef = {messagesWindowRef} setDateRefsArray = {setDateRefsArray}/>
							<span className="scrollToBottomElement" ref={scrollToBottomElementRef}></span>
							<TypingAnimation typingPeople = {chatData.typing}/>
						</div>
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
			{chatData.wallpaper !== "undefined"?<img src={chatData.wallpaper} className = "chatWallpaper" alt=""/>:null}
		</div>
	)
}
