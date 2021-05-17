import React, { createRef } from 'react'
import { useState } from 'react'
import { Redirect, useRouteMatch } from 'react-router'
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
	const [chatData, setChatData] = useState(chat[chatId])
	const scrollToBottomElementRef = useRef(null)
	const messagesWindowRef = useRef(null)
	const scrollToMessageRef = useRef(null)
	const [attachedSongs, setAttachedSongs] = useState([])
	const [loading, setLoading] = useState(true)
	const [scrollToMessageId, setScrollToMessageId] = useState(-1)
	async function fetchChatData() {
		const chat = (await firestore.collection('chats').doc(chatId).get()).data()
		setChatData(chat)
		setLoading(false)
	}
	useEffect(() => {
		fetchChatData()
	}, [chatId])

	const scrollToMyRef = () => {
		if (!loading) {
			const scroll = messagesWindowRef.current.scrollHeight - messagesWindowRef.current.clientHeight;
			messagesWindowRef.current.scrollTo(0, scroll);
		}
	};

	useEffect(() => {
		if (chatData !== undefined) {
			if (!chatData.participants.includes(currentUser.uid)) return <Redirect to='/chat' />
		}
	}, [chatData])

	useEffect(() => {
		if (!loading) {
			scrollToMyRef()
		}
	}, [loading, chatData])

	useEffect(() => {
		if (scrollToMessageId !== -1) {
			messagesWindowRef.current.scrollTo(0, scrollToMessageRef.current.offsetTop - 65)
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
			message: '0',
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

	function shouldShowPhoto(index, currentDate) {
		
	}

	function displayChatMessages() {
		let currentDate = chatData.messages[0].sentTime
		return chatData.messages.map((message, index) => {
			let showPhoto = false
			let showDate = false

			if (index === chatData.messages.length - 1) showPhoto = true
			else if (chatData.messages[index + 1].sender !== chatData.messages[index].sender) showPhoto = true
			else if (displayDate(chatData.messages[index + 1].sentTime) !== displayDate(currentDate)) showPhoto = true

			if (index === 0) showDate = true
			else if (displayDate(chatData.messages[index].sentTime) !== displayDate(currentDate)) {
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
	return (
		<div className="DialoguePage">
			{
				loading ?
					<LoadingCircle /> :
					<>
						<ChatHeader data={chatData} />
						<div className="chatMessagesWindow" ref={messagesWindowRef}>
							{
								displayChatMessages()
							}
							<span className="scrollToBottomElement" ref={scrollToBottomElementRef}></span>
						</div>
						<ChatInput chatId={chatId} sendMessage={sendMessage} setAttachedSongs={setAttachedSongs} attachedSongs={attachedSongs} />
					</>
			}
		</div>
	)
}
