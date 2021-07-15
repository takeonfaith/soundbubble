import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import displayDate from '../../functions/display/displayDate'
import { findAmountOfUnseenMessages } from '../../functions/find/findAmountOfUnseenMessages'
import { IsUserOnlineCircle } from '../Basic/IsUserOnlineCircle'
import { AmountOfUnseenMessages } from './AmountOfUnseenMessages'
import { LastSentMessage } from './LastSentMessage'

export const ChatItem = ({ chatData }) => {
	const { currentUser } = useAuth()
	const { chatName, chatImage, participants, messages } = chatData
	const [otherPerson, setOtherPerson] = useState({})
	const [amountOfUnseen, setAmountOfUnseen] = useState(0)

	useEffect(() => {
		setAmountOfUnseen(findAmountOfUnseenMessages(messages, currentUser))
	}, [])
	async function fetchOtherPerson() {
		const otherPersonId = participants.find(personId => personId !== currentUser.uid)
		const person = (await firestore.collection('users').doc(otherPersonId).get()).data()
		setOtherPerson(person)
	}

	useEffect(() => {
		if (chatName === '') {
			fetchOtherPerson()
		}
	}, [])
	return chatData?(
		<Link to={`/chat/${chatData.id}`}>
			<div className={"ChatItem " + (amountOfUnseen > 0?"unseen":"")} >
				<div className="chatItemImage">
					<img loading = "lazy" src={chatImage || otherPerson.photoURL} alt="" />
				</div>
				<IsUserOnlineCircle userUID = {otherPerson.uid}/>
				<div style={{ width: '100%' }}>
					<h4 style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
						<span>{chatName || otherPerson.displayName}</span>
						<div>
							{messages.length?<span style={{ opacity: '.6', fontWeight: '500', fontSize: '.8em' }}>{displayDate(messages[messages.length - 1].sentTime, chatData && ( Date.now() - new Date(messages[messages.length - 1].sentTime).getTime()) > 86000000 ? 0 : 2)}</span>:null}
							<AmountOfUnseenMessages amountOfUnseen = {amountOfUnseen}/>
						</div>
					</h4>
					{messages.length?<p style={messages[messages.length - 1].sender !== currentUser.uid ? { color: '#fff' } : {}}>{<LastSentMessage messages={messages} />}</p>:null}
				</div>
			</div>
		</Link>
	):null
}
