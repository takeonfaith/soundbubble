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
import {FriendsListToShareWith} from '../Basic/FriendsListToShareWith'
export const Share = () => {
	const {currentSongData} = useSong()
	const socialMedia = [
		<ImWhatsapp />,
		<FaFacebookF />,
		<FaTelegramPlane />,
		<FaVk />,
		<AiFillInstagram />
	]
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
			<div className="sharePeopleShort">
				<FriendsListToShareWith item = {currentSongData} whatToShare = {'song'}/>
			</div>
		</div>
	)
}
