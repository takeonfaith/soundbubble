import React, { useState } from 'react'
import { useAuth } from '../../functionality/AuthContext'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { addOrDeleteSongToPlaylist } from '../../functions/addOrDeleteSongToPlaylist'
import {FiPlusCircle, FiCheck} from 'react-icons/fi'
export const AddToPlaylists = ({song}) => {
	const {yourPlaylists, currentSongData} = useSong()
	const {currentUser} = useAuth()
	const [songData, setsongData] = useState(song || currentSongData)
	return (
		<div className = "AddToPlaylists">
			<div style = {{display:'flex', flexDirection:'column'}}>
				{yourPlaylists.map((playlist, key) => {
					if (currentUser.ownPlaylists.includes(playlist.id)) {
						return (
							<div className="songItemMenuWindowItem" onClick={(e) => addOrDeleteSongToPlaylist(e, playlist.id, songData, yourPlaylists)} key={key} id={key}>
								{!playlist.songs.includes(songData.id) ? <FiPlusCircle /> : <FiCheck />}
								{playlist.name}
							</div>
						)
					}
				})}
			</div>
		</div>
	)
}
