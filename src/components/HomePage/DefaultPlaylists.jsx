import React, { useEffect } from 'react'
import { useState } from 'react'
import { firestore } from '../../firebase'
import { PlaylistItem } from '../AuthorPage/PlaylistItem'

export const DefaultPlaylists = () => {
	const [topPlaylistData, setTopPlaylistData] = useState([])
	const playlistData = {
		image:"https://st4.depositphotos.com/37959478/39745/v/450/depositphotos_397457330-stock-illustration-fire-icon-fire-icon-vector.jpg",
		creationDate:new Date().toString(),
		name:'Top 10 Songs',
		isAlbum:false, 
		songs:topPlaylistData
	}

	async function findSongsForTop(){
		const orderedSongs = firestore.collection('songs').orderBy('listens', 'desc')
		const data = await orderedSongs.get()
		data.docs.forEach((song, index)=>{
			console.log(song.data())
			if(index < 10){
				setTopPlaylistData(prev=>[...prev, song.data().id])
			}
		})
	}

	useEffect(() => {
		findSongsForTop()
	}, [])
	return (
		<div className = "DefaultPlaylists">
			<PlaylistItem playlist = {playlistData}/>
		</div>
	)
}
