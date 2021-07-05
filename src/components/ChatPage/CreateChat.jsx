import React, { useState } from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../functionality/AuthContext'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { createChat } from '../../functions/createChat'
import getUID from '../../functions/getUID'
import { DownloadPhotoButton } from '../Basic/DownloadPhotoButton'
import { ErrorPlate } from '../Basic/ErrorPlate'
import { PersonTiny } from '../Basic/PersonTiny'
import { SearchBar } from '../Basic/SearchBar'
import {findChatURL} from '../../functions/findChatURL'
export const CreateChat = () => {
	const {currentUser} = useAuth()
	const { yourFriends } = useSong()
	const [searchValue, setSearchValue] = useState("")
	const [foundFriends, setFoundFriends] = useState(yourFriends)
	const [chosenFriends, setChosenFriends] = useState([])
	const [chatCover, setChatCover] = useState("")
	const [chatName, setChatName] = useState("")
	const [errorMessage, setRrrorMessage] = useState("")
	const chatId = getUID()
	const history = useHistory()
	const [shouldCreate, setShouldCreate] = useState(false)
	const [friendChatId, setFriendChatId] = useState(0)
	useEffect(() => {
		if(chosenFriends.length >= 1){
			findChatURL(chosenFriends, currentUser, setShouldCreate, setFriendChatId)
		}
	}, [chosenFriends])
	return (
		<div className="CreateChat">
			<SearchBar value={searchValue} setValue={setSearchValue} setResultAuthorList={setFoundFriends} focus inputText={"Search for friends"} defaultSearchMode={"authors"} />
			{foundFriends.map(friend => {
				return <PersonTiny data={friend} chosenArray={chosenFriends} setChosenArray={setChosenFriends} />
			})}
			{chosenFriends.length > 1 && shouldCreate ?
				<div>
					<input type="text" style={{ marginBottom: '10px' }} className="standartInput" placeholder={"Enter chat name"} value={chatName} onChange={e => setChatName(e.target.value)} />
					<DownloadPhotoButton setErrorMessage={setRrrorMessage} setImageLocalPath={() => { return null }} downloadedPhoto={chatCover} setDownloadedPhoto={setChatCover} place={'chatCovers/'} btnText = {"Download chat image"}/>
				</div> : null
			}
			<ErrorPlate errorMessage={errorMessage} />
			{chosenFriends.length >= 1?<button className="addSongBtn" onClick = {()=>{if(shouldCreate) {createChat([currentUser.uid, ...chosenFriends], chatId, chatName, chatCover, [currentUser.uid]); history.push(`/chat/${chatId}`)} else history.push(`/chat/${friendChatId}`)}}>{shouldCreate?"Create Chat":"Go to chat"}</button>:null}
		</div>
	)
}
