import React, { useEffect, useState } from 'react'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { FiPlus, FiXCircle } from 'react-icons/fi'
import { auth, firestore, storage } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import getUID from '../../functions/getUID'
import { AddPlaylist } from '../AddWindow/AddPlaylist'
import { AddSong } from '../AddWindow/AddSong'
import { PersonTiny } from '../Basic/PersonTiny'
import { Slider } from '../Tools/Slider'

export const AddWindow = ({ data }) => {
	const { currentUser } = useAuth()
	const [openAddSongWindow, setOpenAddSongWindow] = useState(false)
	const [currentSliderPage, setCurrentSliderPage] = useState(0)
	const sliderPages = [<AddSong/>, <AddPlaylist/>]
	return (((currentUser.email === 'takeonfaith6@gmail.com') || (data.isAuthor)) && (data.uid === currentUser.uid)) ?
		(
			<div className="AddSong">
				<button onClick={() => setOpenAddSongWindow(!openAddSongWindow)} style={openAddSongWindow ? { background: 'var(--red)' } : {}} className = "openAddSongWindowBtn">
					<FiPlus style={openAddSongWindow ? { transform: 'rotate(45deg)' } : {}} />
				</button>
				<div className="addSongWindow" style={openAddSongWindow ? { display: 'flex' } : {}}>
					<Slider pages = {['Song', 'Playlists']} currentPage = {currentSliderPage} setCurrentPage = {setCurrentSliderPage}/>
					{sliderPages[currentSliderPage]}
				</div>
			</div>
		) :
		null
}
