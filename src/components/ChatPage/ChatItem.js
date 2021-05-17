import React, { useEffect, useState } from 'react'
import { BiAlbum } from 'react-icons/bi'
import { FiMusic, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { authors } from '../../data/authors'
import { chat } from '../../data/chat'
import { playlists } from '../../data/playlists'
import { songs } from '../../data/songs'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import displayDate from '../../functions/displayDate'

export const ChatItem = ({chatData}) => {
	const {currentUser} = useAuth()
	const {id, chatName, chatImage, participants} = chatData
	const [otherPerson, setOtherPerson] = useState({})
	const [lastMessageSongName, setLastMessageSongName] = useState("")
	async function fetchOtherPerson() {
		const otherPersonId = participants.find(personId => personId !== currentUser.uid)
		const person = (await firestore.collection('users').doc(otherPersonId).get()).data()
		setOtherPerson(person)
	}

	useEffect(() => {
		fetchLastMessageSong()
		if(chatName === ''){
			fetchOtherPerson()
		}
	}, [])

	async function fetchLastMessageSong() {
		if(chatData.messages !== undefined && chatData.messages[chatData.messages.length-1].attachedSongs.length !== 0){
			const lastMessageSong = (await firestore.collection('songs').doc(chatData.messages[chatData.messages.length-1].attachedSongs[0]).get()).data().name
			setLastMessageSongName(lastMessageSong)
		}
	}
	async function findWhatToWriteUnderName(){
		if(chatData.messages !== undefined){
			const lastMessage = chatData.messages[chatData.messages.messages.length-1]
			if(lastMessage.attachedSongs.length){
				
				return (
					<div className = "messageShowOutside">
						<FiMusic/>
						{lastMessageSongName}
					</div>
				)
			}
			// if(chat[chatId].messages[chat[chatId].messages.length-1].attachedAlbums.length){
			// 	const playlistName = playlists['allPlaylists'][chat[chatId].messages[chat[chatId].messages.length-1].attachedAlbums[0]].name
			// 	return (
			// 		<div className = "messageShowOutside">
			// 			<BiAlbum/>
			// 			{playlistName}
			// 		</div>
			// 	)
			// }
			// if(chat[chatId].messages[chat[chatId].messages.length-1].attachedAuthors.length){
			// 	const authorName = authors[chat[chatId].messages[chat[chatId].messages.length-1].attachedAuthors[0]].name
			// 	return (
			// 		<div className = "messageShowOutside">
			// 			<FiUser/>
			// 			{authorName}
			// 		</div>
			// 	)
			// }
		}
	}

	function displayLastMessageSentTime(){
		// if(chat[chatId].messages[chat[chatId].messages.length-1] !== undefined){
		// 	let lastMessageSentTime =  chat[chatId].messages[chat[chatId].messages.length-1].sentTime
		// 	return displayDate(lastMessageSentTime, 2)
		// }
	}
	
	return (
		<Link to = {`/chat/${chatData.id}`}>
			<div className = "ChatItem">
				<div className = "chatItemImage">
					<img src={chatImage || otherPerson.photoURL} alt=""/>
				</div>
				<div style = {{width:'100%'}}>
					<h4 style = {{display:'flex', justifyContent:'space-between', width:'100%'}}>
						<span>{chatName || otherPerson.displayName}</span>
						<span style = {{opacity:'.6', fontWeight:'500', fontSize:'.8em'}}>{displayLastMessageSentTime()}</span>
					</h4>
					{/* <p>{findWhatToWriteUnderName()}</p> */}
					<p>{lastMessageSongName}</p>
				</div>
			</div>
		</Link>
	)
}
