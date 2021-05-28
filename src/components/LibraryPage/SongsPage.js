import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import wave from '../../images/wave2.svg'
import shuffleSongs from '../../functions/shuffleSongs'
import { useAuth } from '../../functionality/AuthContext'
import { firestore } from '../../firebase'
import {LibraryPlaylistItem} from '../../components/LibraryPage/LibraryPlaylistItem'
import { SongItem } from '../../components/FullScreenPlayer/SongItem'
export const SongsPage = () => {
	const {yourSongs, yourPlaylists, setCurrentSongQueue, setCurrentSongPlaylistSource } = useSong()
	const {currentUser} = useAuth()
	function setQueueInLibrary(){
		setCurrentSongQueue(yourSongs)
		setCurrentSongPlaylistSource({ source: '/library', name: "Your Library", image: currentUser.photoURL, songsList: yourSongs})
		shuffleSongs(yourSongs)
		firestore.collection('users').doc(currentUser.uid).update({
			lastQueue:{
				image:currentUser.photoURL,
				name:"Your Library",
				songsList:yourSongs,
				source:'/library'
			}
		})
	}
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
			<div className="yourSongsList" onClick = {setQueueInLibrary}>
				{yourSongs.map((song, index) => {
					return (
						<SongItem song = {song} localIndex = {index} key={index} />
					)
				})}
			</div>
		</div>
	)
}
