import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSong } from '../../contexts/SongContext'
import { addOrDeleteSongToPlaylist } from '../../functions/add/addOrDeleteSongToPlaylist'
import { FiPlusCircle, FiCheck } from 'react-icons/fi'
import { Hint } from '../Basic/Hint'
import { useAddOrDeleteSong } from '../../hooks/useAddOrDeleteSong'
import { AddToPlaylistItem } from '../Playlist/AddToPlaylistItem'
export const AddToPlaylists = ({ song }) => {
	const { yourPlaylists, currentSongData } = useSong()
	const { currentUser } = useAuth()
	
	const [songData, setSongData] = useState(song || currentSongData)
	useEffect(() => {
		if (song?.id) {
			setSongData(song)
		}
	}, [song?.id])
	return (
		<div className="AddToPlaylists">
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{yourPlaylists.length ? yourPlaylists.map((playlist, key) => {
					if (currentUser.ownPlaylists.includes(playlist.id)) {
						return (
							<AddToPlaylistItem playlist = {playlist} song = {songData}/>
						)
					}
				}) : "No playlists created"}
			</div>
		</div>
	)
}
