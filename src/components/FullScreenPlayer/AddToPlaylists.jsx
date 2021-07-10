import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSong } from '../../contexts/SongContext'
import { addOrDeleteSongToPlaylist } from '../../functions/addOrDeleteSongToPlaylist'
import {FiPlusCircle, FiCheck} from 'react-icons/fi'
import { Hint } from '../Basic/Hint'
export const AddToPlaylists = ({song}) => {
	const {yourPlaylists, currentSongData} = useSong()
	const {currentUser} = useAuth()
	const [songData, setSongData] = useState(song || currentSongData)
	useEffect(() => {
		if(song && song.id){
			setSongData(song)
		}
	}, [song])
	return (
		<div className = "AddToPlaylists">
			<div style = {{display:'flex', flexDirection:'column'}}>
				{yourPlaylists.map((playlist, key) => {
					if (currentUser.ownPlaylists.includes(playlist.id)) {
						return (
							<div className="songItemMenuWindowItem" onClick={(e) => addOrDeleteSongToPlaylist(e, playlist.id, songData, yourPlaylists)} key={key} id={key}>
								{!playlist.songs.includes(songData.id) ? <><Hint text = {`Add "${songData.name}" to playlist`}/><FiPlusCircle /></> : <><Hint text = {`Remove ${currentSongData.name} from playlist`}/><FiCheck /></>}
								{playlist.name}
							</div>
						)
					}
				})}
			</div>
		</div>
	)
}