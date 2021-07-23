import React, { useState } from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useSong } from '../../contexts/SongContext'
import { createChat } from '../../functions/create/createChat'
import getUID from '../../functions/other/getUID'
import { DownloadPhotoButton } from '../Buttons/DownloadPhotoButton'
import { ErrorPlate } from '../MessagePlates/ErrorPlate'
import { PersonTiny } from '../Basic/PersonTiny'
import { SearchBar } from '../Basic/SearchBar'
import { findChatURL } from '../../functions/find/findChatURL'
import { useModal } from '../../contexts/ModalContext'
export const CreateChat = () => {
	const { currentUser } = useAuth()
	const {toggleModal} = useModal()
	const { yourFriends } = useSong()
	const [searchValue, setSearchValue] = useState("")
	const [foundFriends, setFoundFriends] = useState(yourFriends)
	const [chosenFriends, setChosenFriends] = useState([])
	const [chatCover, setChatCover] = useState("")
	const [chatName, setChatName] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const chatId = getUID()
	const history = useHistory()
	const [shouldCreate, setShouldCreate] = useState(false)
	const [friendChatId, setFriendChatId] = useState(0)
	const [allowedToCreate, setAllowedToCreate] = useState(false)
	useEffect(() => {
		if (chosenFriends.length >= 1) {
			findChatURL(chosenFriends, currentUser, setShouldCreate, setFriendChatId)
		}
	}, [chosenFriends])

	useEffect(() => {
		if (chatName.length === 0 || chosenFriends.length === 0) {
			setAllowedToCreate(false)
		}
		else setAllowedToCreate(true)
		setErrorMessage("")
	}, [chosenFriends.length, chatName])
	return (
		<div className="CreateChat">
			<SearchBar value={searchValue} setValue={setSearchValue} setResultAuthorList={setFoundFriends} focus inputText={"Search for friends"} defaultSearchMode={"authors"} />
			{foundFriends.map(friend => {
				return <PersonTiny data={friend} chosenArray={chosenFriends} setChosenArray={setChosenFriends} />
			})}
			{chosenFriends.length > 1 && shouldCreate ?
				<div>
					<h3>Chat name</h3>
					<input type="text" style={{ marginBottom: '10px' }} className="standartInput" placeholder={"Enter chat name"} value={chatName} onChange={e => setChatName(e.target.value)} />
					<h3>Chat image</h3>
					<DownloadPhotoButton setErrorMessage={setErrorMessage} setImageLocalPath={() => { return null }} downloadedPhoto={chatCover} setDownloadedPhoto={setChatCover} place={'chatCovers/'} btnText={"Download chat image"} />
				</div> : null
			}
			<ErrorPlate errorMessage={errorMessage} />
			{chosenFriends.length >= 1 ?
				<button className="addSongBtn" style={shouldCreate ? allowedToCreate ? {} : { opacity: '0.4' } : {}}
					onClick={() => {
						if (shouldCreate) {
							if (allowedToCreate) {
								createChat([currentUser.uid, ...chosenFriends], chatId, chatName, chatCover, [currentUser.uid]);
								history.push(`/chat/${chatId}`)
								toggleModal()
							}
							else setErrorMessage("Chat has to have a name")
						}
						else {
							history.push(`/chat/${friendChatId}`)
							toggleModal()
						}
					}}>
					{shouldCreate ? "Create Chat" : "Go to chat"}
				</button> : null}
		</div>
	)
}
