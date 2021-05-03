import React from 'react'
import { BiAlbum } from 'react-icons/bi'
import { FiMusic, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { authors } from '../../data/authors'
import { chat } from '../../data/chat'
import { playlists } from '../../data/playlists'
import { songs } from '../../data/songs'
import displayDate from '../../functions/displayDate'

export const ChatItem = ({participantsIds, chatId}) => {
	const otherPersons = (participantsIds.map(personId => authors[personId])).filter(el=>el.id!==30)
	function findWhatToWriteUnderName(){
		if(chat[chatId].messages[chat[chatId].messages.length-1] !== undefined){
			if(chat[chatId].messages[chat[chatId].messages.length-1].attachedSongs.length){
				const songName = songs['allSongs'][chat[chatId].messages[chat[chatId].messages.length-1].attachedSongs[0]].name
				return (
					<div className = "messageShowOutside">
						<FiMusic/>
						{songName}
					</div>
				)
			}
			if(chat[chatId].messages[chat[chatId].messages.length-1].attachedAlbums.length){
				const playlistName = playlists['allPlaylists'][chat[chatId].messages[chat[chatId].messages.length-1].attachedAlbums[0]].name
				return (
					<div className = "messageShowOutside">
						<BiAlbum/>
						{playlistName}
					</div>
				)
			}
			if(chat[chatId].messages[chat[chatId].messages.length-1].attachedAuthors.length){
				const authorName = authors[chat[chatId].messages[chat[chatId].messages.length-1].attachedAuthors[0]].name
				return (
					<div className = "messageShowOutside">
						<FiUser/>
						{authorName}
					</div>
				)
			}
		}
	}

	function displayLastMessageSentTime(){
		if(chat[chatId].messages[chat[chatId].messages.length-1] !== undefined){
			let lastMessageSentTime =  chat[chatId].messages[chat[chatId].messages.length-1].sentTime
			return displayDate(lastMessageSentTime, 2)
		}
	}
	return (
		<Link to = {`/chat/${chatId}`}>
			<div className = "ChatItem">
				<div className = "chatItemImage">
					<img src={otherPersons[0].image} alt=""/>
				</div>
				<div style = {{width:'100%'}}>
					<h4 style = {{display:'flex', justifyContent:'space-between', width:'100%'}}>
						<span>{otherPersons[0].name}</span>
						<span style = {{opacity:'.6', fontWeight:'500', fontSize:'.8em'}}>{displayLastMessageSentTime()}</span>
					</h4>
					<p>{findWhatToWriteUnderName()}</p>
				</div>
			</div>
		</Link>
	)
}
