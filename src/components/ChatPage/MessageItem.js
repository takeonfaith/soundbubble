import React, { useEffect, useRef, useState } from 'react'
import { AiFillFire, AiFillLike } from 'react-icons/ai'
import { BiShare } from 'react-icons/bi'
import { FcLike } from 'react-icons/fc'
import { useSwipeable } from 'react-swipeable'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useScreen } from '../../contexts/ScreenContext'
import displayDate from '../../functions/display/displayDate'
import { findWhatToWriteInResponseToItem } from '../../functions/find/findWhatToWriteInResponseItem'
import useOnScreen from '../../hooks/useOnScreen'
import { AuthorItemBig } from '../AuthorPage/AuthorItemBig'
import { PlaylistItem } from '../AuthorPage/PlaylistItem'
import { SongItemLoading } from '../Basic/SongItemLoading'
import { SongItem } from '../FullScreenPlayer/SongItem'
import { SeenByCircle } from './SeenByCircle'

export const MessageItem = ({ messageData, chatId, scrollToMessageRef, setScrollToMessageId, scrollToMessageId, showPhoto = true, otherMessages, inResponseToMessageArr, setInResponseToMessageArr }) => {
	const { currentUser } = useAuth()
	const {isMobile, screenHeight} = useScreen()
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
	const [swipeDeltaX, setSwipeDeltaX] = useState(0)
	const [transformTransition, setTransformTransition] = useState(0)
	const handlers = useSwipeable({ onSwiping: (event) => {if(event.deltaX < 0) setSwipeDeltaX(event.deltaX)} })
	const refPassthrough = (el) => {
		// call useSwipeable ref prop with el
		handlers.ref(el);

		// set myRef el so you can access it yourself
		messageRef.current = el;
	}
	useEffect(() => {
		if (messageData.seenBy !== undefined) {
			if (currentUser.uid !== messageData.sender && isVisible) {
				if (!messageData.seenBy.includes(currentUser.uid)) {
					const tempMessages = otherMessages
					tempMessages[messageData.id].seenBy.push(currentUser.uid)
					firestore.collection('chats').doc(chatId).update({
						messages: tempMessages
					})
				}
			}
		}
	}, [isVisible])

	async function fetchSentMessageUser() {
		const user = (await firestore.collection('users').doc(messageData.sender).get()).data()
		setUserThatSentMessage(user)
	}

	function fetchAttachedData(list, place, setFunc) {
		return list.forEach(async (itemId) => {
			let itemData = (await firestore.collection(place).doc(itemId).get())
			if(itemData.exists) setFunc(prev => [...prev, itemData.data()])
			else setFunc(prev => [...prev, null])
			
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

	function returnToInitial() {
		let dropDelta
		clearTimeout(dropDelta)
		setTransformTransition(0.2)
		dropDelta = setTimeout(() => {
		  setSwipeDeltaX(0)
		  setTransformTransition(0)
		}, 200)
	 }

	useEffect(() => {
		if(swipeDeltaX < -160){
			returnToInitial()
			addMessageToResponseList()
		}
	}, [swipeDeltaX])


	const emojis = [<FcLike />, <AiFillFire />, <AiFillLike />]
	return (
		<div className={"MessageItem " + (sender === currentUser.uid ? 'your' : '')} ref={id === scrollToMessageId ? scrollToMessageRef : refPassthrough} style={showPhoto ? { paddingBottom: '15px', transform:`translateX(${swipeDeltaX}px)`, transition:transformTransition } : {transform:`translateX(${swipeDeltaX}px)`, transition:transformTransition}} onTouchEnd = {returnToInitial}>
			<div className="messageItemImage">
				{showPhoto ?
					<img loading = "lazy" src={userThatSentMessage.photoURL} alt="" /> :
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
								<span style={{ display: 'flex', alignItems: 'center' }}>
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
						return isVisible ? <SongItem song={song} localIndex={key} key={key} position = {screenHeight}/> : <SongItemLoading />
					})}
					{attachedPlaylistsData.map((album, index) => {
						return <PlaylistItem playlist={album} key={index} />
					})}
					{attachedAuthorsData.map((author, index) => {
						return <AuthorItemBig data={author} key={index} />
					})}
				</div>

			</div>
			<SeenByCircle listOfSeen={messageData.seenBy} />
			<button className="respondToMessageBtn" onClick={addMessageToResponseList} style = {isMobile?{opacity:-swipeDeltaX/80}:{}}>
				<BiShare />
			</button>
		</div>
	)
}
