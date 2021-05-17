import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { playlists } from '../data/playlists'
import {Header} from '../components/AuthorPage/Header'
import { songs } from '../data/songs'
import {SongItem} from '../components/FullScreenPlayer/SongItem'
import { useSong } from '../functionality/SongPlay/SongContext'
import { firestore } from '../firebase'
import { useAuth } from '../functionality/AuthContext'
import { LoadingCircle } from '../components/Basic/LoadingCircle'
export const AlbumPage = () => {
	const match = useRouteMatch('/albums/:albumId')
	const [playlistSongs, setPlaylistSongs] = useState([])
	const [headerColors, setHeaderColors] = useState([])
	const { albumId } = match.params
	const [albumData, setAlbumData] = useState([])
	const {setCurrentSongQueue, setCurrentSongPlaylistSource} = useSong()
	const {currentUser} = useAuth()
	const [loading, setLoading] = useState(true)
	async function fetchAlbums() {
		const response = firestore.collection("playlists").doc(albumId)
		response.get().then((doc) => {

			if (doc.exists) {
				console.log("dewqeq")
				 console.log("Document data:", doc.data());
				 setAlbumData(doc.data())
				 setHeaderColors(doc.data().imageColors)
			} else {
				 console.log("No such document!");
			}
	  }).catch((error) => {
			console.log("Error getting document:", error);
	  });
	}

	function fetchSongsInAlbum() {
		if(albumData.length !== 0){
			albumData.songs.map(async songId=>{
				let albumSong = (await firestore.collection('songs').doc(songId).get()).data()
				setPlaylistSongs(prev=>[...prev, albumSong])
			})
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAlbums()
	}, [albumId])

	useEffect(() => {
		fetchSongsInAlbum()
	}, [albumData])

	function setQueueInAlbum(){
		const source = {source:`/albums/${albumData.id}`,name:albumData.name, image:albumData.image, songsList:playlistSongs}
		setCurrentSongQueue(playlistSongs)
		setCurrentSongPlaylistSource(source)
		firestore.collection('users').doc(currentUser.uid).update({
			lastQueue:{
				image:source.image,
				name:source.name,
				songsList:source.songsList,
				source:source.source
			}
		})
	}
	return (
		<div className = "AlbumPage" style = {{animation:'zoomIn .2s forwards'}}>
			{loading?<LoadingCircle top = {'50%'}/>:
				<>
					<Header data = {albumData} headerColors = {headerColors} setHeaderColors = {setHeaderColors}/>
					{/* <h5>{playlistsSong.length} songs</h5> */}
					<div onClick = {setQueueInAlbum}>
						{playlistSongs.map((song, index)=>{
							return <SongItem song = {song} localIndex = {index} key = {index}/>
						})}
					</div>
				</>
			}
			
		</div>
	)
}
