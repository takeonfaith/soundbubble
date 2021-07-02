import React, { useEffect, useState } from 'react'
import { BiAlbum } from 'react-icons/bi'
import { FiMusic, FiUser } from 'react-icons/fi'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import {BsDot} from 'react-icons/bs'
import shortWord from '../../functions/shortWord'
import { SeenByCircle } from './SeenByCircle'
export const LastSentMessage = ({ messages }) => {
	const {currentUser} = useAuth()
	const [lastAttachedItem, setLastAttachedItem] = useState("")
	const [shouldPutDot, setShouldPutDot] = useState(false)
	const [lastMessage, setLastMessage] = useState("")
	const messageIcons = [null, <FiMusic />, <BiAlbum />, <FiUser />]
	const [lastIcon, setLastIcon] = useState(0)
	async function findWhatToWriteUnderName() {
		if (messages !== undefined) {
			const lastAttachedItem = messages[messages.length - 1]
			setLastMessage(str => str += lastAttachedItem.message)
			setShouldPutDot(lastAttachedItem.message.length !== 0) 
			if (lastAttachedItem.attachedSongs.length) {
				const songName = (await firestore.collection('songs').doc(lastAttachedItem.attachedSongs[0]).get()).data().name
				setLastIcon(1)
				setLastAttachedItem(str => str += songName)
			}
			if (lastAttachedItem.attachedAlbums.length) {
				const playlistName = (await firestore.collection('playlists').doc(lastAttachedItem.attachedAlbums[0]).get()).data().name
				setLastIcon(2)
				setLastAttachedItem(str => str +=playlistName)
			}
			if (lastAttachedItem.attachedAuthors.length) {
				const authorName = (await firestore.collection('users').doc(lastAttachedItem.attachedAuthors[0]).get()).data().displayName
				setLastIcon(3)
				setLastAttachedItem(str => str +=authorName)
			}
		}
	}

	useEffect(() => {
		findWhatToWriteUnderName()
	}, [])
	return (
		<div className="messageShowOutside">
			{messages[messages.length - 1].sender === currentUser.uid?<span style = {{marginRight:'5px'}}>You:</span>:null}
			{shortWord(lastMessage, 30)}
			{shouldPutDot && lastAttachedItem.length?<BsDot/>:null}
			{messageIcons[lastIcon]}
			{lastAttachedItem}
			<SeenByCircle listOfSeen = {messages[messages.length - 1].seenBy}/>
		</div>
	)
}
