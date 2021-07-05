import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/normalizeString'
import shortWord from '../../functions/shortWord'
import {HiPause, HiPlay} from 'react-icons/hi'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { firestore } from '../../firebase'
import { useEffect } from 'react'
export const LibraryPlaylistItem = ({playlist}) => {
	const playlistDate = new Date(playlist.creationDate)
	const {setCurrentSongQueue, setCurrentSongPlaylistSource, playSong, setCurrentSongInQueue, setCurrentSong, currentSongPlaylistSource, songRef, setPlay, play} = useSong()
	const [playlistSongs, setPlaylistSongs] = useState([])
	function fetchSongsInAlbum() {
		if(playlist.length !== 0){
			playlist.songs.map(async songId=>{
				let albumSong = (await firestore.collection('songs').doc(songId).get()).data()
				setPlaylistSongs(prev=>[...prev, albumSong])
			})
		}
	}

	function playChosenPlaylist(e){
		e.preventDefault()
		if(currentSongPlaylistSource.name === playlist.name){
			playSong()
			return 
		}
		fetchSongsInAlbum()
		
	}
	useEffect(() => {
		if(playlistSongs.length){
			setCurrentSongQueue(playlistSongs)
			setCurrentSongInQueue(0)
			setCurrentSong(playlistSongs[0].id)
			songRef.current.play()
			setPlay(true)
			setCurrentSongPlaylistSource({source:`/albums/${playlist.id}`, name:playlist.name, image:playlist.image, songsList:playlistSongs})
		}
	}, [playlistSongs.length])

	return (
		<Link to={`/albums/${playlist.id}`} className = "playlistWrapper">
			<div className="library playlistItem">
				{playlist.image?<div className = "playlistImageWrapper"><img src={playlist.image} alt="" /></div>:<h1>{playlist.name.split(' ')[0][0]}{playlist.name.split(' ')[1][0]}</h1>}
				<h2 style = {{background:playlist.imageColors[2]}}>{shortWord(playlist.name, 10) }</h2>
				<button onClick = {playChosenPlaylist}>
					{(currentSongPlaylistSource.name === playlist.name) && play?<HiPause/>:<HiPlay/>}
				</button>
			</div>
		</Link>
	)
}
