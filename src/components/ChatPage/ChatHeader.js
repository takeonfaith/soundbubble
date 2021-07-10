import React, { useEffect } from 'react'
import { useState } from 'react'
import { BackBtn } from '../Basic/BackBtn'
import { Link } from 'react-router-dom'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { ChatMoreBtn } from './ChatMoreBtn'
import { LastSeen } from '../Basic/LastSeen'
import { useModal } from '../../contexts/ModalContext'
import { ChatInfo } from './ChatInfo'
export const ChatHeader = ({ data }) => {
	const { currentUser } = useAuth()
	const {toggleModal, setContent} = useModal()
	const [otherPerson, setOtherPerson] = useState({})
	const [headerColors, setHeaderColors] = useState(data.chatName === ""?[]:data.imageColors)
	async function fetchOtherPerson() {
		const otherPersonId = data.participants.find(personId => personId !== currentUser.uid)
		const person = (await firestore.collection('users').doc(otherPersonId).get()).data()
		setOtherPerson(person)
		setHeaderColors(person.imageColors)
	}

	useEffect(() => {
		if (data.chatName === "") {
			fetchOtherPerson()
		}
	}, [data.id])
	return (
		<div className="ChatHeader" style={headerColors.length ? { background: `linear-gradient(45deg, ${headerColors[0]}, ${headerColors[1]})` } : { background: `linear-gradient(45deg, grey, lightgrey)` }}>
			<BackBtn />
			{data.participants.length === 2 ? <Link className="chatHeaderImageAndName" to={`/authors/${otherPerson.uid}`}>
				<div className="chatHeaderImage">
					<img src={otherPerson.photoURL || data.chatImage} alt="" />
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
					<h4>{otherPerson.displayName || data.chatName}</h4>
					<LastSeen userUID={otherPerson.uid} />
				</div>
			</Link> :
				<div className="chatHeaderImageAndName" onClick = {()=>{toggleModal(); setContent(<ChatInfo data = {data}/>)}}>
					<div className="chatHeaderImage">
						<img src={otherPerson.photoURL || data.chatImage} alt="" />
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
						<h4>{otherPerson.displayName || data.chatName}</h4>
						<LastSeen userUID={otherPerson.uid} />
					</div>
				</div>
			}
			<ChatMoreBtn chatId={data.id} data={data} currentWallpaper={data.wallpaper} />
		</div>
	)
}
