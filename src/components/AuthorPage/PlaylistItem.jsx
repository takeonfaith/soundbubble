import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/other/normalizeString'
import shortWord from '../../functions/other/shortWord'
import {HiPause, HiPlay} from 'react-icons/hi'
import { useSong } from '../../contexts/SongContext'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { AddToListCircle } from '../Tools/AddToListCircle'
import { useScreen } from '../../contexts/ScreenContext'
import { usePlaylistSongs } from '../../hooks/usePlaylistSongs'
import { DeletedPlaylist } from '../Playlist/DeletedPlaylist'
import { BiAlbum } from 'react-icons/bi'
export const PlaylistItem = ({playlist = null, listOfChosenAlbums, setListOfChosenAlbums}) => {
	const playlistDate = new Date(playlist?.creationDate)
	const {isMobile} = useScreen()
	const {currentSongPlaylistSource, play} = useSong()
	const [playlistSongs, setPlaylistSongs] = useState([])
	const playSongsInPlaylist = usePlaylistSongs(playlist, playlistSongs, setPlaylistSongs)
	return playlist !== null?(
		<Link to={`/albums/${playlist.id}`} style = {{textDecoration:'none'}} className = "playlistWrapper">
			<AddToListCircle listOfChosenItems = {listOfChosenAlbums} setListOfChosenItems = {setListOfChosenAlbums} itemId = {playlist.id}/>
			<div className="playlistItem" style = {playlist.image?{backgroundImage:`url(${playlist.image})`}:{background:'var(--yellowAndPinkGrad)'}}>
				{!playlist.image?<BiAlbum style = {{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)', width:'60px', height:'60px'}}/>:null}
				{!isMobile?<button onClick = {playSongsInPlaylist}>
					{(currentSongPlaylistSource.name === playlist.name) && play?<HiPause/>:<HiPlay/>}
				</button>:null}
			</div>
			<h4 style = {{display:'flex', alignItems:'center', margin:'5px 0'}}>
				{shortWord(playlist.name, isMobile?10:15)} 
				<span style = {{fontSize:".6em", opacity:.6, fontWeight:'500', marginLeft:'7px'}}>
					{playlist.isAlbum?playlist.songs.length === 1?"single":'album':'playlist'}
				</span>
			</h4>
			<h5 style = {{margin:'5px 0'}}>{playlistDate.getFullYear()}</h5>
		</Link>
	):<DeletedPlaylist/>
}