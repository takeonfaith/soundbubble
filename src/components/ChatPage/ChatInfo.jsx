import React, { useState } from 'react'
import { useEffect } from 'react'
import { firestore } from '../../firebase'
import { useFetchFirebaseData } from '../../hooks/fetchFirebaseData'
import { useFetchDocs } from '../../hooks/useFetchDocs'
import { LoadingCircle } from '../Basic/LoadingCircle'
import { PersonTiny } from '../Basic/PersonTiny'
import {FiSettings, FiVolume2} from 'react-icons/fi'
import { BiCrown } from 'react-icons/bi'
import {ImAttachment} from 'react-icons/im'
import shortWord from '../../functions/shortWord'
import { useModal } from '../../functionality/ModalClass'
import { AttachmentList } from './AttachmentList'
import { Slider } from '../Tools/Slider'

export const ChatInfo = ({ data }) => {
	const [participants, setParticipants] = useState([])
	const [loading, setLoading] = useState(true)
	const [chatNameValue, setChatNameValue] = useState(data.chatName)
	const {setContent} = useModal()
	const [participantsPage, setParticipantsPage] = useState(0)
	useFetchDocs(setLoading, data.participants, setParticipants, [data.id])	
	return(
		<div className="ChatInfo">
			<div className="chatInfoImageAndName">
				<div className="chatInfoImage">
					<img src={data.chatImage} alt="" />
				</div>
				<div>
					<input type="text" className = "standartInput" value = {chatNameValue} onChange = {(e)=>setChatNameValue(e.target.value)}/>
					<div className = "chatInfoButtons">
						<button className="chatInfoButton">
							<FiSettings/>
							Settings
						</button>
						<button className="chatInfoButton" onClick = {()=>setContent(<AttachmentList chatId = {data.id}/>)}>
							<ImAttachment/>
							{shortWord("Attachments", 7)} 
						</button>
						<button className="chatInfoButton">
							<FiVolume2/>
							Sound
						</button>
					</div>
				</div>
			</div>
			<h4>Chat participants</h4>
			<Slider pages = {['All participants', "Administrators"]} currentPage = {participantsPage} setCurrentPage = {setParticipantsPage}/>
			{!loading?participants.map(person => {
				if(participantsPage === 1){
					if(data.admins.includes(person.uid)) return <PersonTiny data={person} key={person.uid} />
				}
				else return <PersonTiny data={person} key={person.uid} />
			}):<LoadingCircle/>}
		</div>
	)
}
