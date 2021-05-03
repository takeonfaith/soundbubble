import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { playlists } from '../data/playlists'
import {Header} from '../components/AuthorPage/Header'
import { songs } from '../data/songs'
import {SongItem} from '../components/FullScreenPlayer/SongItem'
import { useSong } from '../functionality/SongPlay/SongContext'
export const AlbumPage = () => {
	const match = useRouteMatch('/albums/:album')
	const [playlistsSong, setPlaylistsSong] = useState([])
	const [headerColors, setHeaderColors] = useState([])
	const { album } = match.params
	const [albumData, setAlbumData] = useState([])
	const {setCurrentSongQueue, setCurrentSongPlaylistSource} = useSong()
	useEffect(() => {
		const currentAlbum = playlists['allPlaylists'].find((a, index) => {
			let normalizedAuthor = a.name.replace(/\s/g, '-').toLowerCase()
			if (normalizedAuthor === album) {
				setAlbumData(a)
				return a
			}
		})
		setPlaylistsSong(currentAlbum.songs.map(songId=>songs['allSongs'][songId]))
	}, [album])
	function setQueueInAlbum(){
		setCurrentSongQueue(playlistsSong)
		setCurrentSongPlaylistSource({source:'albums',name:albumData.name, image:albumData.image, songsList:playlistsSong})
	}
	return (
		<div className = "AlbumPage" style = {{animation:'zoomIn .2s forwards'}}>
			<Header data = {albumData} headerColors = {headerColors} setHeaderColors = {setHeaderColors}/>
			{/* <h5>{playlistsSong.length} songs</h5> */}
			<div onClick = {setQueueInAlbum}>
				{playlistsSong.map((song, index)=>{
					return <SongItem song = {song} localIndex = {index} key = {index}/>
				})}
			</div>
			
		</div>
	)
}
