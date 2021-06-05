import React, { createRef } from 'react'
import { useState } from 'react'
import { Redirect, useHistory, useRouteMatch } from 'react-router'
import { ChatHeader } from '../components/ChatPage/ChatHeader'
import { MessageItem } from '../components/ChatPage/MessageItem'
import { chat } from '../data/chat'
import { useOutsideClick } from '../hooks/useOutsideClick'
import { useRef } from 'react'
import { ChatInput } from '../components/AuthorPage/ChatInput'
import { useEffect } from 'react'
import { firestore } from '../firebase'
import { useAuth } from '../functionality/AuthContext'
import { LoadingCircle } from '../components/Basic/LoadingCircle'
import firebase from 'firebase'
import displayDate from '../functions/displayDate'
export const DialoguePage = () => {
	const match = useRouteMatch('/chat/:chatId')
	const { currentUser } = useAuth()
	// const [playlistsSong, setPlaylistsSong] = useState([])
	// const [headerColors, setHeaderColors] = useState([])
	const { chatId } = match.params
	const [messageText, setMessageText] = useState("")
	const [chatData, setChatData] = useState([])
	const scrollToBottomElementRef = useRef(null)
	const messagesWindowRef = useRef(null)
	const scrollToMessageRef = useRef(null)
	const [attachedSongs, setAttachedSongs] = useState([])
	const [loading, setLoading] = useState(true)
	const [scrollToMessageId, setScrollToMessageId] = useState(-1)
	const [messagesToRender, setMessagesToRender] = useState([])
	const history = useHistory()
	const scrollToMyRef = () => {
		const scroll = messagesWindowRef.current.scrollHeight - messagesWindowRef.current.clientHeight;
		messagesWindowRef.current.scrollTo(0, scroll);
	};
	async function fetchChatData() {
		setChatData([])
		const chat = (await firestore.collection('chats').doc(chatId).get()).data()
		setChatData(chat)
		const tempChatMessages = chat.messages.slice(0).reverse()
		tempChatMessages.length = tempChatMessages.length > 13?13:tempChatMessages.length
		setMessagesToRender(tempChatMessages.slice(0).reverse())
		setLoading(false)
	}
	useEffect(() => {
		fetchChatData()
	}, [chatId])

	useEffect(() => {
		if (chatData.participants !== undefined) {
			if (!chatData.participants.includes(currentUser.uid)) history.push('/chat')
		}
	}, [chatData])

	useEffect(() => {
		if (!loading) {
			if(messagesToRender.length !== 0) scrollToMyRef()
		}
	}, [chatData.length])

	useEffect(() => {
		if (scrollToMessageId !== -1) {
			messagesWindowRef.current.scrollTo(0, scrollToMessageRef.current.offsetTop - 65 < 0?0:scrollToMessageRef.current.offsetTop - 65)
			setTimeout(() => {
				setScrollToMessageId(-1)
			}, 500)
		}
	}, [scrollToMessageId])


	function sendMessage() {
		const tempMessages = chatData.messages

		tempMessages.push({
			id: chatData.messages.length,
			sender: currentUser.uid,
			message: messageText,
			sentTime: new Date(),
			inResponseToMessage: null,
			attachedSongs: attachedSongs,
			attachedAlbums: [],
			attachedAuthors: [],
		})
		setAttachedSongs([])
		setChatData(prev => { return { ...prev, messages: tempMessages } })

		firestore.collection('chats').doc(chatId).update({
			messages: tempMessages
		})
	}


	function whatMessagesToRender(e){
		if(e.target.scrollTop === 0){
			const scrollToMessage = chatData.messages.length - (messagesToRender.length + 2) <= 0? 1 : chatData.messages.length - (messagesToRender.length + 2)
			console.log(scrollToMessage)
			for (let i = messagesToRender.length; i < messagesToRender.length + ((chatData.messages.length-messagesToRender.length) - 15 > 0?15:chatData.messages.length-messagesToRender.length); i++) {
				// console.log(i)
				setMessagesToRender(prev=>[chatData.messages[chatData.messages.length - 1 - i], ...prev])
			}
			setScrollToMessageId(scrollToMessage)
		}
	}


	function displayChatMessages() {
		if(messagesToRender.length > 0){
			let currentDate = messagesToRender[0].sentTime
			return messagesToRender.map((message, index) => {
				let showPhoto = false
				let showDate = false
	
				if (index === messagesToRender.length - 1) showPhoto = true
				else if (messagesToRender[index + 1].sender !== messagesToRender[index].sender) showPhoto = true
				else if (displayDate(messagesToRender[index + 1].sentTime) !== displayDate(currentDate)) showPhoto = true
	
				if (index === 0) showDate = true
				else if (displayDate(messagesToRender[index].sentTime) !== displayDate(currentDate)) {
					showDate = true
					currentDate = message.sentTime
				}
	
				return (
					<>
						<div style={showDate ? { width: '100%', display: 'flex', justifyContent: 'center', alignItems: "center", padding: "10px 0" } : { display: 'none' }}>{displayDate(message.sentTime)}</div>
						<MessageItem
							messageData={message}
							chatId={chatId}
							key={index}
							scrollToMessageRef={scrollToMessageRef}
							scrollToMessageId={scrollToMessageId}
							setScrollToMessageId={setScrollToMessageId}
							showPhoto={showPhoto}
						/>
					</>
				)
					
			})
		}
	}
	return (
		<div className="DialoguePage">
			{
				loading ?
					<LoadingCircle /> :
					<>
						<ChatHeader data={chatData} />
						<div className="chatMessagesWindow" ref={messagesWindowRef} onScroll = {whatMessagesToRender}>
							{
								displayChatMessages()
							}
							<span className="scrollToBottomElement" ref={scrollToBottomElementRef}></span>
						</div>
						<ChatInput chatId={chatId} sendMessage={sendMessage} setAttachedSongs={setAttachedSongs} attachedSongs={attachedSongs} setMessageText = {setMessageText}/>
					</>
			}
		</div>
	)
}
