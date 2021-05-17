import React, { useState } from 'react'
import { SongItem } from '../components/FullScreenPlayer/SongItem'
import "../styles/LibraryPage.css"
import { useSong } from '../functionality/SongPlay/SongContext'
import wave from '../images/wave2.svg'
import { PlaylistItem } from '../components/AuthorPage/PlaylistItem'
import shuffleSongs from '../functions/shuffleSongs'
import { useAuth } from '../functionality/AuthContext'
import { firestore } from '../firebase'
import { Slider } from '../components/Tools/Slider'
export const LibraryPage = () => {
	const {yourSongs, yourPlaylists, setCurrentSongQueue, setCurrentSongPlaylistSource } = useSong()
	const {currentUser} = useAuth()
	const [currentPage, setCurrentPage] = useState(0)
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
		<div className="LibraryPage" style = {{animation:'zoomIn .2s forwards'}}>
			<div className="playLists">
				<Slider pages = {['Main', "Playlists", "Authors"]} currentPage = {currentPage} setCurrentPage = {setCurrentPage}/>
				<div className="playlistContent">
					{yourPlaylists.map((p, index) => {
						return (
							<PlaylistItem playlist = {p} key = {index}/>
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
