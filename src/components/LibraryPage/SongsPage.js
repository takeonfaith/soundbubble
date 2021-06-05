import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import wave from '../../images/wave2.svg'
import { useAuth } from '../../functionality/AuthContext'
import {LibraryPlaylistItem} from '../../components/LibraryPage/LibraryPlaylistItem'
import { SongList } from '../Basic/SongList'
export const SongsPage = () => {
	const {yourSongs, yourPlaylists } = useSong()
	const {currentUser} = useAuth()
	return (
		<div className = "SongsPage">
			<div className="playLists">
				<div className="playlistContent">
					{yourPlaylists.map((p, index) => {
						return (
							<LibraryPlaylistItem playlist = {p} key = {index}/>
						)
					})}
				</div>
				<div className="playlistsBackground">
					<img src={wave} alt="erwerrnjeqjweqwqeqwewerbjfrwjfbewjerbh"/>
				</div>
			</div>
			<div className="yourSongsList">
				<SongList listOfSongs = {yourSongs} source = {{ source: '/library', name: "Your Library", image: currentUser.photoURL, songsList: yourSongs}}/>
			</div>
		</div>
	)
}
