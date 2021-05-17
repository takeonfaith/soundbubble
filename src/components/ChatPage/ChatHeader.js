import React, { useEffect } from 'react'
import { useState } from 'react'
import { authors } from '../../data/authors'
import { ColorExtractor } from 'react-color-extractor'
import { BackBtn } from '../Basic/BackBtn'
import { MoreBtn } from '../Basic/MoreBtn'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/normalizeString'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import { ChatMoreBtn } from './ChatMoreBtn'
export const ChatHeader = ({ data }) => {
	const { currentUser } = useAuth()
	const [otherPerson, setOtherPerson] = useState({})
	const [headerColors, setHeaderColors] = useState([])
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
	}, [])
	return (
		<div className="ChatHeader" style={headerColors.length ? { background: `linear-gradient(45deg, ${headerColors[0]}, ${headerColors[1]})` } : { background: `linear-gradient(45deg, grey, lightgrey)` }}>
			<BackBtn />
			<Link className="chatHeaderImageAndName" to={`/authors/${otherPerson.uid}`}>
				<div className="chatHeaderImage">
					<img src={otherPerson.photoURL || data.chatName} alt="" />
				</div>
				<h4>{otherPerson.displayName || data.chatImage}</h4>
			</Link>
			<ChatMoreBtn/>
		</div>
	)
}
