import React, { useEffect, useState } from 'react'
import { AiFillFire, AiFillLike } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import { authors } from '../../data/authors'
import { chat } from '../../data/chat'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import displayDate from '../../functions/displayDate'
import { AuthorItemBig } from '../AuthorPage/AuthorItemBig'
import { PlaylistItem } from '../AuthorPage/PlaylistItem'
import { SongItem } from '../FullScreenPlayer/SongItem'

export const MessageItem = ({ messageData, chatId, scrollToMessageRef, setScrollToMessageId, scrollToMessageId, showPhoto = true}) => {
	const {currentUser} = useAuth()
	const {message, attachedAlbums, attachedSongs, attachedAuthors, sender, inResponseToMessage, id, sentTime} = messageData
	const [userThatSentMessage, setUserThatSentMessage] = useState({})
	const [attachedSongsData, setAttachedSongsData] = useState([])
	const [attachedAuthorsData, setAttachedAuthorsData] = useState([])
	const [attachedPlaylistsData, setAttachedPlaylistsData] = useState([])
	function findWhatToWriteInResponseToItem(referedMessage){
		return referedMessage.attachedSongs.length ? "Audio":
		referedMessage.attachedAlbums.length? "Album":
		referedMessage.attachedAuthors.length?"Author":""
	}

	async function fetchSentMessageUser(){
		const user = (await firestore.collection('users').doc(messageData.sender).get()).data()
		setUserThatSentMessage(user)
	}

	function fetchAttachedData(list, place, setFunc){
		return list.forEach(async (itemId) => {
			let itemData = (await firestore.collection(place).doc(itemId).get()).data()
			setFunc(prev=>[...prev, itemData])
		})
	}

	useEffect(() => {
		fetchSentMessageUser()
		fetchAttachedData(attachedSongs, 'songs', setAttachedSongsData)
		fetchAttachedData(attachedAuthors, 'users', setAttachedAuthorsData)
		fetchAttachedData(attachedAlbums, 'playlists', setAttachedPlaylistsData)
	}, [])


	const emojis = [<FcLike />,<AiFillFire/>, <AiFillLike />]
	return (
		<div className={"MessageItem " + (sender === currentUser.uid?'your':'')}  ref = {id === scrollToMessageId?scrollToMessageRef:null} style = {showPhoto?{paddingBottom:'15px'}:{}}>
			<div className = "messageItemImage">
				{showPhoto?
					<img src={userThatSentMessage.photoURL} alt=""/>:
					null
				}
				
			</div>
			<div className="messageItemBody" style = {id === scrollToMessageId?{animation:'showResponseMessage .5s forwards'}:showPhoto?{borderRadius:'var(--standartBorderRadius2) var(--standartBorderRadius) var(--standartBorderRadius) 5px'}:{}}>	
				{inResponseToMessage !== null?
					<div className = "responseItem" onClick = {()=>setScrollToMessageId(inResponseToMessage)}>
						<h5>{authors[chat[chatId].messages[inResponseToMessage].sender].name}</h5>
						<p>
							{emojis[chat[chatId].messages[inResponseToMessage].message]}
							<span style = {{marginLeft:'5px', color:'var(--reallyLightBlue)'}}>
								{findWhatToWriteInResponseToItem(chat[chatId].messages[inResponseToMessage])}
							</span>
						</p> 
					</div>:null
				}
				<div>	
					<p>{message}</p>
					{attachedSongsData.map((song, key)=>{
						return <SongItem song = {song} localIndex = {key} key = {key}/>
					})}
					{attachedPlaylistsData.map((album, index) => {
						return <PlaylistItem playlist={album} key={index} />
					})}
					{attachedAuthorsData.map((author, index) => {
						return <AuthorItemBig data={author} key={index} />
					})}
				</div>
				<div style = {{fontSize:'.7em', opacity:'.8', position:'absolute', top:'9px', right:'9px'}}>{displayDate(sentTime, 2)}</div>
			</div>
		</div>
	)
}
