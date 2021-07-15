import React, { useEffect, useState } from 'react'
import { useSong } from '../../contexts/SongContext'
import wave from '../../images/wave2.svg'
import { useAuth } from '../../contexts/AuthContext'
import { LibraryPlaylistItem } from './LibraryPlaylistItem'
import { SongList } from '../Lists/SongList'
import { Link } from 'react-router-dom'
import { firestore } from '../../firebase'
import { useScreen } from '../../contexts/ScreenContext'
import { findVisiblePlaylists } from '../../functions/find/findVisiblePlaylists'
export const SongsPage = () => {
	const { yourSongs, yourPlaylists, setYourSongs } = useSong()
	const { currentUser } = useAuth()
	const {screenWidth} = useScreen()
	const [playlistsVisible, setPlaylistsVisible] = useState(findVisiblePlaylists(screenWidth))
	useEffect(() => {
		setPlaylistsVisible(findVisiblePlaylists(screenWidth))
	}, [screenWidth])
	return (
		<div className="SongsPage">
			<div className="playLists">
				<div className="playlistContent">
					{yourPlaylists.length?yourPlaylists.map((p, index) => {
						if(index < playlistsVisible){
							return (
								<LibraryPlaylistItem playlist={p} key={index} />
							)
						}
					}):<h3 style = {{position:'absolute', left:'50%', top:'40%', transform:'translate(-50%, -50%)'}}>You don't have playlists</h3>}
				</div>
				<div className="playlistsBackground">
					<img loading = "lazy" src={wave} alt="erwerrnjeqjweqwqeqwewerbjfrwjfbewjerbh" />
				</div>
			</div>
			<div className="yourSongsList">
				<SongList listOfSongs={yourSongs} source={{ source: '/library', name: "Your Library", image: currentUser.photoURL, songsList: yourSongs }} showSearch displayIfEmpty={<h3>Your library is empty</h3>} />
			</div>
		</div>
	)
}
