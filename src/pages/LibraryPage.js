import React from 'react'
import { SongItem } from '../components/FullScreenPlayer/SongItem'
import "../styles/LibraryPage.css"
import { useSong } from '../functionality/SongPlay/SongContext'
import wave from '../images/wave2.svg'
import { PlaylistItem } from '../components/AuthorPage/PlaylistItem'
import shuffleSongs from '../functions/shuffleSongs'
export const LibraryPage = () => {
	const {yourSongs, yourPlaylists, setCurrentSongQueue, setCurrentSongPlaylistSource } = useSong()
	function setQueueInLibrary(){
		setCurrentSongQueue(yourSongs)
		setCurrentSongPlaylistSource({ source: 'library', name: "Your Library", image: "https://sun9-66.userapi.com/impf/c636628/v636628089/46fc5/jZmb1Eadwqs.jpg?size=960x1280&quality=96&sign=ee424378e70207bd5f8ab2aa5a669b81&type=album", songsList: yourSongs})
		shuffleSongs(yourSongs)
	}
	return (
		<div className="LibraryPage" style = {{animation:'zoomIn .2s forwards'}}>
			<div className="playLists">
				<div className="playlistsBackground">
					<img src={wave} alt="erwerrnjeqjweqwqeqwewerbjfrwjfbewjerbh"/>
				</div>
				{yourPlaylists.map((p, index) => {
					return (
						<PlaylistItem playlist = {p} key = {index}/>
					)
				})}
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
