import React from 'react'
import { useState } from 'react'
import { Redirect, useRouteMatch } from 'react-router'
import { ChatHeader } from '../components/ChatPage/ChatHeader'
import { MessageItem } from '../components/ChatPage/MessageItem'
import { chat } from '../data/chat'
import { useOutsideClick } from '../hooks/useOutsideClick'
import { useRef } from 'react'
import { ChatInput } from '../components/AuthorPage/ChatInput'
import { useEffect } from 'react'
export const DialoguePage = () => {
	const match = useRouteMatch('/chat/:chatId')
	// const [playlistsSong, setPlaylistsSong] = useState([])
	// const [headerColors, setHeaderColors] = useState([])
	const { chatId } = match.params
	const [chatData, setChatData] = useState(chat[chatId])
	const scrollToBottomElementRef = useRef(null)
	const messagesWindowRef = useRef(null)
	const scrollToMessageRef = useRef(null)
	const [scrollToMessageId, setScrollToMessageId] = useState(-1)
	useEffect(() => {
		setChatData(chat[chatId])
	}, [chat[chatId]])

	const scrollToMyRef = () => {
		const scroll = messagesWindowRef.current.scrollHeight -messagesWindowRef.current.clientHeight;
		messagesWindowRef.current.scrollTo(0, scroll);
	 };

	useEffect(() => {
		scrollToMyRef()
	}, [chat[chatId].messages.length])

	useEffect(() => {
		if(scrollToMessageId !== -1){
			messagesWindowRef.current.scrollTo(0, scrollToMessageRef.current.offsetTop-65)
			setTimeout(()=>{
				setScrollToMessageId(-1)
			}, 500)
		}
	}, [scrollToMessageId])

	if (!chatData.participants.includes(30)) return <Redirect to='/chat' />
	function sendMessage(){
		chat[chatId].messages.push({
			id:chat[chatId].messages.length,
			sender:30,
			message:'0',
			sentTime:new Date(),
			inResponseToMessage:0,
			attachedSongs:[23],
			attachedAlbums:[],
			attachedAuthors:[],
		})
	}
	return (
		<div className="DialoguePage">
			<ChatHeader data={chatData} />
			<div className="chatMessagesWindow" ref = {messagesWindowRef}>
				{
					chatData.messages.map((message, index) => {
						return (
							<MessageItem 
								messageData={message} 
								chatId = {chatId} 
								key={index}  
								scrollToMessageRef = {scrollToMessageRef} 
								scrollToMessageId = {scrollToMessageId}
								setScrollToMessageId = {setScrollToMessageId}
							/>
						)
					})
				}
				<span className = "scrollToBottomElement" ref = {scrollToBottomElementRef}></span>
			</div>
			<ChatInput chatId = {chatId} sendMessage = {sendMessage}/>
		</div>
	)
}
