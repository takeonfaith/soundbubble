import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AiFillFire, AiFillLike } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import { ImAttachment } from 'react-icons/im'
import { MdSend } from 'react-icons/md'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { SearchBar } from '../Basic/SearchBar'
import { SongList } from '../Basic/SongList'
import { AuthorsList } from '../Basic/AuthorsList'
import { AlbumList } from '../Basic/AlbumList'
import { FiX, FiUser } from 'react-icons/fi'
import { CgMusicNote } from 'react-icons/cg'
import { BiAlbum } from 'react-icons/bi'
import { useAuth } from '../../functionality/AuthContext'
import { findWhatToWriteInResponseToItem } from '../../functions/findWhatToWriteInResponseItem'
import { auth, firestore } from '../../firebase'
import { sendMessage } from '../../functions/sendMessage'
import shortWord from '../../functions/shortWord'
import { AttachedItemsInChatInput } from '../ChatPage/AttachedItemsInChatInput'

export const ChatInput = ({ chatId, chatData, messageText, setMessageText, inResponseToMessage, setInResponseToMessage, otherMessages }) => {
	const { currentUser } = useAuth()
	const [openAttachWindow, setOpenAttachWindow] = useState(false)
	const { yourSongs, yourAuthors, yourPlaylists } = useSong()
	const [searchValue, setSearchValue] = useState("")
	const [allFoundSongs, setAllFoundSongs] = useState(yourSongs)
	const [searchSongList, setSearchSongList] = useState([])
	const [attachedSongs, setAttachedSongs] = useState([])
	const [attachedAlbums, setAttachedAlbums] = useState([])
	const [attachedAuthors, setAttachedAuthors] = useState([])
	const [resultPlaylists, setResultPlaylists] = useState(yourPlaylists)
	const [resultAuthorList, setResultAuthorList] = useState(yourAuthors)
	const [inResponseNames, setInResponseNames] = useState([])
	const [attachedSongsNames, setAttachedSongsNames] = useState([])
	const attachWindowRef = useRef(null)
	useOutsideClick(attachWindowRef, setOpenAttachWindow)

	function sendMessageFull() {
		sendMessage(chatId, chatData, currentUser.uid, messageText, attachedSongs, attachedAlbums, attachedAuthors, inResponseToMessage);
		setMessageText("");
		setAttachedSongs([]);
		setAttachedAuthors([]);
		setAttachedAlbums([]);
		setInResponseToMessage([])
		setOpenAttachWindow(false)
	}
	useEffect(() => {
		if (searchValue.length === 0) {
			setAllFoundSongs(yourSongs)
		}
	}, [searchValue])

	function removeMessageFromResponseList(messageId) {
		setInResponseToMessage(inResponseToMessage.filter(id => id !== messageId))
	}

	useEffect(() => {
		if(messageText.length === 0){
			firestore.collection('chats').doc(chatId).update({
				typing:chatData.typing.filter(id=>id !== currentUser.uid)
			})
		}
		else{
			if(!chatData.typing.includes(currentUser.uid)){
				const tempArray = chatData.typing
				tempArray.push(currentUser.uid)
				firestore.collection('chats').doc(chatId).update({
					typing:tempArray
				})
			}
		}
	}, [messageText])

	
	useEffect(() => {
		setInResponseNames([])
		inResponseToMessage.forEach(async id => {

			const name = (await firestore.collection('users').doc(otherMessages[id].sender).get()).data().displayName
			setInResponseNames(prev => [...prev, name])
		})
	}, [inResponseToMessage.length])

	useEffect(() => {
		setAttachedSongsNames([])
		attachedSongs.forEach(async id => {
			const name = (await firestore.collection('songs').doc(id).get()).data().name
			setAttachedSongsNames(prev => [...prev, name])
		})
	}, [attachedSongs.length])

	return (
		<div className="chatInput" style={openAttachWindow ? { borderRadius: "0 0 var(--standartBorderRadius) var(--standartBorderRadius)", transition: ".2s" } : {}} ref={attachWindowRef}>
			<div className="attachWindow" style={openAttachWindow ? { height: "400px", opacity: '1' } : {}} >
				{openAttachWindow ?
					<div style={openAttachWindow ? { maxHeight: '100%', overflowY: 'auto' } : { display: 'none' }}>
						<SearchBar
							value={searchValue}
							setValue={setSearchValue}
							setAllFoundSongs={setAllFoundSongs}
							setResultPlaylists={setResultPlaylists}
							setResultAuthorList={setResultAuthorList}
						/>
						<SongList listOfSongs={allFoundSongs} source={'no'} listOfChosenSongs={attachedSongs} setListOfSongs={setAttachedSongs} />
						<AuthorsList listOfAuthors={resultAuthorList} listOfChosenAuthors={attachedAuthors} setListOfChosenAuthors={setAttachedAuthors} />
						<AlbumList listOfAlbums={resultPlaylists} loading={false} listOfChosenAlbums={attachedAlbums} setListOfChosenAlbums={setAttachedAlbums} />
					</div> :
					null
				}
			</div>
			<div className="inResponseArea" style={inResponseToMessage.length || attachedSongsNames.length || attachedAuthors.length || attachedAlbums.length ? {} : { height: '0', padding: '0', opacity: '0', top: "0", visibility: 'hidden' }}>
				<div className="responseMessages">
					
					{inResponseToMessage.map((id, index) => {
						return (
							<div className="responseItem" key={id}>
								<h5 style={otherMessages[id].sender === currentUser.uid ? { color: "var(--lightPurple)" } : {}}>{inResponseNames[index]}</h5>
								<p>
									{shortWord(otherMessages[id].message, 35)}
									<span style={{ marginLeft: '5px', color: 'var(--reallyLightBlue)' }}>
										{findWhatToWriteInResponseToItem(otherMessages[id])}
									</span>
								</p>
								<button onClick={() => removeMessageFromResponseList(id)} className="removeMessageFromResponse">
									<FiX />
								</button>
							</div>
						)
					})}
				</div>
				<AttachedItemsInChatInput attachedItems = {attachedSongs} setAttachedItems = { setAttachedSongs} icon = {<CgMusicNote />}/>
				<AttachedItemsInChatInput attachedItems = {attachedAuthors} setAttachedItems = { setAttachedAuthors} icon = {<FiUser />}/>
				<AttachedItemsInChatInput attachedItems = {attachedAlbums} setAttachedItems = { setAttachedAlbums} icon = {<BiAlbum />}/>
			</div>
			<div className="attachAndEmojis">
				<div className="attachBtn">
					<button onClick={() => { setOpenAttachWindow(!openAttachWindow) }}>
						<ImAttachment />
					</button>
				</div>
				<input type="text" style={{ background: 'var(--lightGrey)', border: 'none', outline: 'none', minHeight: '100%' }} value={messageText} onChange={(e) => { setMessageText(e.target.value) }} onKeyUp={(e) => { if (e.key === 'Enter') { sendMessageFull() } }} />
				{/* <div className="emojis">
					<div className="emojiItem">
						<FcLike />
					</div>
					<div className="emojiItem" style={{ color: 'var(--red)' }}>
						<AiFillFire />
					</div>
					<div className="emojiItem" style={{ color: 'var(--lightBlue)' }}>
						<AiFillLike />
					</div>
				</div> */}
			</div>
			<button className="sendBtn" onClick={() => { sendMessageFull() }}>
				<MdSend />
			</button>
		</div>
	)
}
