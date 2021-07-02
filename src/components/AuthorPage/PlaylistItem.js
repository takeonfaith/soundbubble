import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/normalizeString'
import shortWord from '../../functions/shortWord'
import {HiPause, HiPlay} from 'react-icons/hi'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import { AddToListCircle } from '../Basic/AddToListCircle'
export const PlaylistItem = ({playlist, listOfChosenAlbums, setListOfChosenAlbums}) => {
	const playlistDate = new Date(playlist.creationDate)
	const {currentUser} = useAuth()
	const {setCurrentSongQueue, setCurrentSongPlaylistSource, playSong, setCurrentSongInQueue, setCurrentSong, currentSongPlaylistSource, songRef, setPlay, play} = useSong()
	const [playlistSongs, setPlaylistSongs] = useState([])
	function fetchSongsInAlbum() {
		setPlaylistSongs([])
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
			const source = {source:`/albums/${playlist.id}`, name:playlist.name, image:playlist.image, songsList:playlistSongs}
			const listSongsIds = playlistSongs.map(song => song.id)
			setCurrentSongQueue(playlistSongs)
			setCurrentSongInQueue(0)
			setCurrentSong(playlistSongs[0].id)
			songRef.current.play()
			setPlay(true)
			setCurrentSongPlaylistSource(source)
			firestore.collection('users').doc(currentUser.uid).update({
				lastSongPlayed: playlistSongs[0].id,
				lastQueue: {
					image: source.image,
					name: source.name,
					songsList: listSongsIds,
					source: source.source
				}
			})
		}
	}, [playlistSongs.length])

	return (
		<Link to={`/albums/${playlist.id}`} style = {{textDecoration:'none'}} className = "playlistWrapper">
			<AddToListCircle listOfChosenItems = {listOfChosenAlbums} setListOfChosenItems = {setListOfChosenAlbums} itemId = {playlist.id}/>
			<div className="playlistItem">
				{playlist.image?<img src={playlist.image} alt="" />:<h1>{playlist.name.split(' ')[0][0]}{playlist.name.split(' ')[1][0]}</h1>}
				{/* {!playlist.isAlbum?<h2>{playlist.name}</h2>:null} */}
				<button onClick = {playChosenPlaylist}>
					{(currentSongPlaylistSource.name === playlist.name) && play?<HiPause/>:<HiPlay/>}
				</button>
			</div>
			<h4 style = {{display:'flex', alignItems:'center', margin:'5px 0'}}>
				{shortWord(playlist.name, 15)} 
				<span style = {{fontSize:".6em", opacity:.6, fontWeight:'500', marginLeft:'7px'}}>
					{playlist.isAlbum?playlist.songs.length === 1?"single":'album':'playlist'}
				</span>
			</h4>
			<h5 style = {{margin:'5px 0'}}>{playlistDate.getFullYear()}</h5>
		</Link>
	)
}
