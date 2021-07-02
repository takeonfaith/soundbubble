import React, { useEffect, useRef, useState } from 'react'
import { AiFillFire, AiFillLike } from 'react-icons/ai'
import { BiShare } from 'react-icons/bi'
import { FcLike } from 'react-icons/fc'
import { authors } from '../../data/authors'
import { chat } from '../../data/chat'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import displayDate from '../../functions/displayDate'
import { findWhatToWriteInResponseToItem } from '../../functions/findWhatToWriteInResponseItem'
import useOnScreen from '../../hooks/useOnScreen'
import { AuthorItemBig } from '../AuthorPage/AuthorItemBig'
import { PlaylistItem } from '../AuthorPage/PlaylistItem'
import { SongItem } from '../FullScreenPlayer/SongItem'
import { SeenByCircle } from './SeenByCircle'

export const MessageItem = ({ messageData, chatId, scrollToMessageRef, setScrollToMessageId, scrollToMessageId, showPhoto = true, otherMessages, inResponseToMessageArr, setInResponseToMessageArr }) => {
	const { currentUser } = useAuth()
	const { message, attachedAlbums, attachedSongs, attachedAuthors, sender, inResponseToMessage, id, sentTime } = messageData
	const [userThatSentMessage, setUserThatSentMessage] = useState({})
	const messageSentTime = displayDate(sentTime, 2)
	const [attachedSongsData, setAttachedSongsData] = useState([])
	const [attachedAuthorsData, setAttachedAuthorsData] = useState([])
	const [attachedPlaylistsData, setAttachedPlaylistsData] = useState([])
	const [inResponseToMessagesData, setInResponseToMessagesData] = useState([])
	const [inResponseNames, setInResponseNames] = useState([])
	const messageRef = useRef()
	const isVisible = useOnScreen(messageRef)
	
	useEffect(() => {
		if(messageData.seenBy !== undefined){
			if(messageData.seenBy.length === 1 && currentUser.uid !== messageData.sender){
				const tempMessages = otherMessages
				tempMessages[messageData.id].seenBy.push(currentUser.uid)
				firestore.collection('chats').doc(chatId).update({
					messages:tempMessages
				})
			}
		}
	}, [isVisible])

	async function fetchSentMessageUser() {
		const user = (await firestore.collection('users').doc(messageData.sender).get()).data()
		setUserThatSentMessage(user)
	}

	function fetchAttachedData(list, place, setFunc) {
		return list.forEach(async (itemId) => {
			let itemData = (await firestore.collection(place).doc(itemId).get()).data()
			setFunc(prev => [...prev, itemData])
		})
	}

	function inResponseMessagesFetch() {
		if (inResponseToMessage !== null) {
			inResponseToMessage.forEach(async messageId => {
				setInResponseToMessagesData(prev => [...prev, otherMessages[messageId]])
				const name = (await firestore.collection('users').doc(otherMessages[messageId].sender).get()).data().displayName
				setInResponseNames(prev => [name, ...prev])
			})
		}
	}

	useEffect(() => {
		fetchSentMessageUser()
		fetchAttachedData(attachedSongs, 'songs', setAttachedSongsData)
		fetchAttachedData(attachedAuthors, 'users', setAttachedAuthorsData)
		fetchAttachedData(attachedAlbums, 'playlists', setAttachedPlaylistsData)
		inResponseMessagesFetch()
	}, [])

	function addMessageToResponseList() {
		if (!inResponseToMessageArr.includes(id)) {
			setInResponseToMessageArr(prev => [...prev, id])
		}
	}


	const emojis = [<FcLike />, <AiFillFire />, <AiFillLike />]
	return (
		<div className={"MessageItem " + (sender === currentUser.uid ? 'your' : '')} ref={id === scrollToMessageId ? scrollToMessageRef : messageRef} style={showPhoto ? { paddingBottom: '15px' } : {}}>
			<div className="messageItemImage">
				{showPhoto ?
					<img src={userThatSentMessage.photoURL} alt="" /> :
					null
				}

			</div>
			<div className="messageItemBody" style={id === scrollToMessageId ? { animation: 'showResponseMessage .5s forwards' } : showPhoto ? { borderRadius: 'var(--standartBorderRadius2) var(--standartBorderRadius) var(--standartBorderRadius) 5px' } : {}}>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
					<h5 className="messageUserName">{userThatSentMessage.displayName}</h5>
					<div style={{ fontSize: '.7em', opacity: '.8', marginLeft: '10px' }}>{messageSentTime}</div>
				</div>
				{inResponseToMessage !== null ?
					inResponseToMessagesData.map((messageData, index) => {
						return (
							<div className="responseItem" onClick={() => setScrollToMessageId(messageData.id)}>
								<span style = {{display:'flex', alignItems:'center'}}>
									<h5 style={messageData.sender === currentUser.uid ? { color: "var(--lightPurple)" } : {}}>
										{inResponseNames[index]}
									</h5>
									<div style={{ fontSize: '.7em', opacity: '.8', marginLeft: '10px' }}>{displayDate(messageData.sentTime, 2)}</div>
								</span>
								<p>
									{messageData.message}
									<span style={{ marginLeft: '5px', color: 'var(--reallyLightBlue)' }}>
										{findWhatToWriteInResponseToItem(messageData)}
									</span>
								</p>
							</div>
						)
					})
					: null
				}
				<div>
					<p>{message}</p>
					{attachedSongsData.map((song, key) => {
						return <SongItem song={song} localIndex={key} key={key} />
					})}
					{attachedPlaylistsData.map((album, index) => {
						return <PlaylistItem playlist={album} key={index} />
					})}
					{attachedAuthorsData.map((author, index) => {
						return <AuthorItemBig data={author} key={index} />
					})}
				</div>

			</div>
			<SeenByCircle listOfSeen = {messageData.seenBy}/>
			<button className="respondToMessageBtn" onClick={addMessageToResponseList}>
				<BiShare />
			</button>
		</div>
	)
}
