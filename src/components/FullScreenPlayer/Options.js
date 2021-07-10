import React from 'react'
import {MdPlaylistAdd} from 'react-icons/md'
import { BiAlbum, BiHeart, BiInfoCircle, BiPlusCircle, BiUserCircle } from "react-icons/bi";
import {FiTrash2, FiPlusCircle, FiInfo} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext';
import { useSong } from '../../contexts/SongContext';
import AddOrDeleteButtonFull from './AddOrDeleteSongButton';
export const Options = () => {
	const {currentUser} = useAuth()
	const {currentSongData, setRightSideCurrentPage} = useSong()
	return (
		<div className='Options'>
			<div className='OptionItem' >
				<AddOrDeleteButtonFull song = {currentSongData}/>
			</div>
			<div className='OptionItem' onClick = {()=>setRightSideCurrentPage(4)}>
				<BiUserCircle />
				Go to author
			</div>
			<div className='OptionItem' onClick = {()=>setRightSideCurrentPage(5)}>
				<MdPlaylistAdd />
				Add to playlist
			</div>
			<div className='OptionItem' onClick = {()=>setRightSideCurrentPage(6)}>
				<FiInfo/>
				Info
			</div>
		</div>
	)
}
