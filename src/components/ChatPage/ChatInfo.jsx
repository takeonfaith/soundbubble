import React, { useState } from 'react'
import { useEffect } from 'react'
import { firestore, storage } from '../../firebase'
import { useFetchFirebaseData } from '../../hooks/fetchFirebaseData'
import { useFetchDocs } from '../../hooks/useFetchDocs'
import { LoadingCircle } from '../Loading/LoadingCircle'
import { PersonTiny } from '../Basic/PersonTiny'
import {FiSettings} from 'react-icons/fi'
import {MdModeEdit} from 'react-icons/md'
import {RiVolumeUpLine } from 'react-icons/ri'
import {ImAttachment} from 'react-icons/im'
import shortWord from '../../functions/other/shortWord'
import { useModal } from '../../contexts/ModalContext'
import { AttachmentList } from './AttachmentList'
import { Slider } from '../Tools/Slider'
import { ColorExtractor } from 'react-color-extractor'

export const ChatInfo = ({ data }) => {
	const [participants, setParticipants] = useState([])
	const [loading, setLoading] = useState(true)
	const [chatNameValue, setChatNameValue] = useState(data.chatName)
	const [newChatPhoto, setNewChatPhoto] = useState(data.chatImage)
	const [newImageLocalPath, setNewImageLocalPath] = useState("")
	const [newImageColors, setNewImageColors] = useState(data.imageColors || [])
	const {setContent} = useModal()
	const [participantsPage, setParticipantsPage] = useState(0)
	const [showUpdateBtn, setShowUpdateBtn] = useState(false)
	useFetchDocs(setLoading, data.participants, setParticipants, [data.id])	
	useEffect(() => {
		if(chatNameValue.trim() !== data.chatName.trim() || newChatPhoto !== data.chatImage){
			setShowUpdateBtn(true)
		}
		else setShowUpdateBtn(false)
	}, [chatNameValue, newChatPhoto])

	useEffect(() => {
		setChatNameValue(data.chatName)
	}, [data.id])

	function updateChatInfo(){
		firestore.collection('chats').doc(data.id).update({
			chatName:chatNameValue,
			chatImage:newChatPhoto,
			imageColors:newImageColors
		})
	}

	async function onFileChange(e, place, setFunc) {
		const file = e.target.files[0]
		setNewImageLocalPath(URL.createObjectURL(file))
		const storageRef = storage.ref()
		const fileRef = storageRef.child(place + file.name)
		await fileRef.put(file)
		setFunc(await fileRef.getDownloadURL())
	}
	return(
		<div className="ChatInfo">
			<ColorExtractor src = {newImageLocalPath} getColors = {(colors)=>setNewImageColors(colors)}/>
			<div className="chatInfoImageAndName">
				<div className="chatInfoImage">
					<label className = "changePhoto">
						<MdModeEdit/>
						Change photo
						<input type="file" style = {{display:'none'}} onChange = {(e)=>onFileChange(e, 'chatCovers/', setNewChatPhoto)}/>
					</label>
					<img loading = "lazy" src={newChatPhoto} alt="" />
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
							<RiVolumeUpLine/>
							Sound
						</button>
					</div>
				</div>
				{showUpdateBtn?<button className = "standartButton" onClick = {updateChatInfo}>Update Chat</button>:null}
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
