import React, { useEffect, useState } from 'react'
import { BiShare } from 'react-icons/bi'
import { FiMessageCircle, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { createChat } from '../../functions/createChat'
import { findChatURL } from '../../functions/findChatURL'
import getUID from '../../functions/getUID'
import shareWithOneFriend from '../../functions/shareWithOneFriend'
import { IsUserOnlineCircle } from '../Basic/IsUserOnlineCircle'

export const Person = ({index, friend}) => {
	const {currentUser} = useAuth()
	const [friendChatId, setFriendChatId] = useState(0)
	const [shouldCreate, setShouldCreate] = useState(false)

	useEffect(() => {
		findChatURL(friend.uid, currentUser, setShouldCreate, setFriendChatId)
	}, [])
	const {currentSong} = useSong()
	return (
		<div className="person" key={index} id={friend.uid} >
			<div className="personBtns">
				<Link to={`/chat/${friendChatId}`}>
					<button onClick = {()=>{if(shouldCreate) createChat([currentUser.uid, friend.uid] ,friendChatId)}}><FiMessageCircle /></button>
				</Link>
				<Link to={`/authors/${friend.uid}`}>
					<button><FiUser /></button>
				</Link>
				<button onClick={(e) => shareWithOneFriend(e, currentSong)}><BiShare /></button>
			</div>
			<div className="pesronImg" style={{ pointerEvents: 'none' }}>
				<img src={friend.photoURL} alt="" />
			</div>
			<IsUserOnlineCircle userUID = {friend.uid}/>
			<div className="personName" style={{ pointerEvents: 'none' }}>
				{friend.displayName}
			</div>
		</div>
	)
}
