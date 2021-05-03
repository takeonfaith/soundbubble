import React, { useState } from 'react'
import { FaFacebookF, FaTelegramPlane, FaVk } from 'react-icons/fa'
import { FiCopy } from 'react-icons/fi'
import { AiFillInstagram } from 'react-icons/ai'
import { ImWhatsapp } from 'react-icons/im'
import { friends } from '../../data/friends'
import { HiSearch } from 'react-icons/hi'
import { BiCheckCircle } from 'react-icons/bi'
import { chat } from '../../data/chat'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { authors } from '../../data/authors'
export const Share = () => {
	const {currentSong} = useSong()
	const socialMedia = [
		<ImWhatsapp />,
		<FaFacebookF />,
		<FaTelegramPlane />,
		<FaVk />,
		<AiFillInstagram />
	]

	const [shareWithWhom, setShareWithWhom] = useState([])
	const [openFullSearch, setOpenFullSearch] = useState(false)

	function addToShareList(friend) {
		if (!shareWithWhom.find(el => el.id === friend.id)) {
			return setShareWithWhom((prev) => [...prev, friend])
		}

		return setShareWithWhom((prev) => prev.filter(el => el.id !== friend.id))
	}

	function shareWithFriends() {
		Object.keys(chat).forEach((chatId, index) => {
			shareWithWhom.map((friend) => {
				if (chat[chatId].participants.includes(friend.id) && chat[chatId].participants.includes(30)) {
					chat[chatId].messages.push(
						{
							id: chat[chatId].messages.length,
							sender: 30,
							message: '',
							sentTime:new Date(),
							inResponseToMessage: null,
							attachedSongs: [currentSong],
							attachedAlbums: [],
							attachedAuthors: [],
						}
					)
				}
			})
		})
		setShareWithWhom([])
	}

	return (
		<div className="Share">
			<button className="shareCopyLink">
				<FiCopy />
				Copy link
			</button>
			<div className="shareOnSocial">
				{socialMedia.map((social, index) => {
					return (
						<div className="shareSocialIcon" key={index}>
							{social}
						</div>
					)
				})}
			</div>
			<div className="sharePeopleShort" style={openFullSearch ? { minHeight: 0, height: 0, opacity: 0, visibility: 'hidden', margin: 0, padding: 0 } : {}}>
				{friends['30'].map((friendId, index) => {
					let friend = authors[friendId]
					if (index < 8) {
						return (
							<div className="shareFriendItem" onClick={() => addToShareList(friend)} key={index}>
								<div className="friendItemImage">
									<img src={friend.image} alt="" />
								</div>
								<div>{friend.name.split(' ')[0]}</div>
								<div className="isInShareList" style={shareWithWhom.find(el => el.id === friend.id) ? { opacity: 1 } : {}}>
									<BiCheckCircle />
								</div>
							</div>
						)
					}

					return 0
				})}
			</div>
			<button className="shareBtn" style={!shareWithWhom.length ? { display: 'none' } : {}} onClick={shareWithFriends}>Share with {shareWithWhom.length} {shareWithWhom.length > 1 ? "friends" : "friend"}</button>
			<div className="shareSearch">
				<input type="text" placeholder={"Search"} onClick={() => setOpenFullSearch(!openFullSearch)} />
				<HiSearch />
			</div>
		</div>
	)
}
