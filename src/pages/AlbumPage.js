import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import {Header} from '../components/AuthorPage/Header'
import { firestore } from '../firebase'
import { LoadingCircle } from '../components/Basic/LoadingCircle'
import { SongList } from '../components/Basic/SongList'
export const AlbumPage = () => {
	const match = useRouteMatch('/albums/:albumId')
	const [playlistSongs, setPlaylistSongs] = useState([])
	const [headerColors, setHeaderColors] = useState([])
	const { albumId } = match.params
	const [albumData, setAlbumData] = useState([])
	const [loading, setLoading] = useState(true)
	async function fetchAlbumsData() {
		const response = firestore.collection("playlists").doc(albumId)
		response.get().then((doc) => {

			if (doc.exists) {
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
		setPlaylistSongs([])
		if(albumData.length !== 0){
			albumData.songs.map(async songId=>{
				let albumSong = (await firestore.collection('songs').doc(songId).get()).data()
				setPlaylistSongs(prev=>[...prev, albumSong])
			})
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAlbumsData()
	}, [albumId])

	useEffect(() => {
		fetchSongsInAlbum()
	}, [albumData])

	return (
		<div className = "AlbumPage" style = {{animation:'zoomIn .2s forwards'}}>
			{
				loading?<LoadingCircle top = {'50%'}/>:
				<>
					<Header data = {albumData} headerColors = {headerColors} setHeaderColors = {setHeaderColors}/>
					<SongList listOfSongs = {playlistSongs} source = {{source:`/albums/${albumData.id}`,name:albumData.name, image:albumData.image, songsList:playlistSongs}}/>
				</>
			}
			
		</div>
	)
}
