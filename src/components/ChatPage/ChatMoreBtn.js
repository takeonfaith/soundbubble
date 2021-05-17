import React, { useRef, useState } from 'react'
import { FiFolder, FiImage, FiMoreHorizontal, FiSearch, FiTrash } from 'react-icons/fi'
import { useOutsideClick } from '../../hooks/useOutsideClick'

export const ChatMoreBtn = () => {
	const [openMoreWindow, setOpenMoreWindow] = useState()
	const chatMoreBtnRef = useRef(null)
	useOutsideClick(chatMoreBtnRef, setOpenMoreWindow)
	return (
		<div className="ChatMoreBtn" ref = {chatMoreBtnRef}>
			<button onClick = {()=>setOpenMoreWindow(!openMoreWindow)}>
				<FiMoreHorizontal />
			</button>
			<div className="chatHeaderMenuWindow" style = {!openMoreWindow?{display:'none'}:{}}>
				<div className="chatHeaderMenuWindowItem">
					<FiSearch/>
					<span>Search messages</span>
				</div>
				<div className="chatHeaderMenuWindowItem">
					<FiFolder/>
					<span>Attachments</span>
				</div>
				<div className="chatHeaderMenuWindowItem">
					<FiImage/>
					<span>Change wallpaper</span>
				</div>
				<div className="chatHeaderMenuWindowItem">
					<FiTrash/>
					<span>Delete chat</span>
				</div>
			</div>
		</div>
	)
}
