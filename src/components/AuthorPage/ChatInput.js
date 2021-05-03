import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AiFillFire, AiFillLike } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import { FiSearch, FiX } from 'react-icons/fi'
import { ImAttachment } from 'react-icons/im'
import { MdSend } from 'react-icons/md'
import { chat } from '../../data/chat'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { BackBtn } from '../Basic/BackBtn'
import { SongItem } from '../FullScreenPlayer/SongItem'

export const ChatInput = ({ chatId, sendMessage }) => {
	const [openAttachWindow, setOpenAttachWindow] = useState(false)
	const [searchValue, setSearchValue] = useState("")
	const attachWindowRef = useRef(null)
	useOutsideClick(attachWindowRef, setOpenAttachWindow)
	const { yourSongs } = useSong()

	// useEffect(() => {
	// 	console.log("rewrwe")
	// }, [chat[chatId].messages.length])
	return (
		<div className="chatInput" style={openAttachWindow ? { borderRadius: "0 0 var(--standartBorderRadius) var(--standartBorderRadius)", transition: ".2s" } : {}}>
			<div className="attachWindow" style={openAttachWindow ? { height: "400px", opacity: '1' } : {}} ref={attachWindowRef}>
				{openAttachWindow ?
					<div style = {openAttachWindow ?{maxHeight:'100%'}:{display:'none'}}>
						<div className="searchBar">
							<div className="searchBarElement">
								<BackBtn />
								<span onClick={() => searchValue.length ? setSearchValue("") : null}>{searchValue.length ? <FiX /> : <FiSearch />}</span>
							</div>
							<input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search for something" />
						</div>
						<div className="attachWindowContent">
							{yourSongs.map((song, index) => {
								return <SongItem song={song} localIndex={index} key={index} />
							})}
						</div>
					</div> :
					null
				}
			</div>
			<div className="attachAndEmojis">
				<div className="attachBtn">
					<button onClick={() => { if (!openAttachWindow) setOpenAttachWindow(true) }}>
						<ImAttachment />
					</button>
				</div>
				<div className="emojis">
					<div className="emojiItem">
						<FcLike />
					</div>
					<div className="emojiItem" style = {{color:'var(--red)'}}>
						<AiFillFire />
					</div>
					<div className="emojiItem" style = {{color:'var(--lightBlue)'}}>
						<AiFillLike />
					</div>
				</div>
			</div>
			<button className="sendBtn" onClick={sendMessage}>
				<MdSend />
			</button>
		</div>
	)
}
