import React from 'react'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/normalizeString'
import shortWord from '../../functions/shortWord'
import {HiPause, HiPlay} from 'react-icons/hi'
import {songs} from '../../data/songs'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { playlists } from '../../data/playlists'
export const PlaylistItem = ({playlist}) => {
	const playlistDate = new Date(playlist.creationDate)
	const {setCurrentSongQueue, setCurrentSongPlaylistSource, playSong, setCurrentSongInQueue, setCurrentSong, currentSongPlaylistSource, songRef, setPlay, play} = useSong()
	function playChosenPlaylist(e){
		e.preventDefault()
		if(currentSongPlaylistSource.name === playlist.name){
			playSong()
			return 
		}
		let playlistSongs = playlist.songs.map((songId)=>songs['allSongs'][songId])
		if(playlistSongs.length){
			setCurrentSongQueue(playlistSongs)
			setCurrentSongInQueue(0)
			setCurrentSong(songs['allSongs'][playlistSongs[0].id].id)
			songRef.current.play()
			setPlay(true)
			setCurrentSongPlaylistSource({source:normalizeString(playlist.name), name:playlist.name, image:playlist.image, songsList:playlistSongs})
		}
	}

	return (
		<Link to={`/albums/${normalizeString(playlist.name)}`}>
			<div className="playlistItem">
				<img src={playlist.image} alt="" />
				{/* {!playlist.isAlbum?<h2>{playlist.name}</h2>:null} */}
				<button onClick = {playChosenPlaylist}>
					{(currentSongPlaylistSource.name === playlist.name) && play?<HiPause/>:<HiPlay/>}
				</button>
			</div>
			<h4 style = {{display:'flex', alignItems:'center'}}>{shortWord(playlist.name, 15)} <span style = {{fontSize:".6em", opacity:.6, fontWeight:'500', marginLeft:'7px'}}>{playlist.songs.length === 1?"single":'album'}</span></h4>
			<h5>{playlistDate.getFullYear()}</h5>
		</Link>
	)
}
