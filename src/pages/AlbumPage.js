import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Header } from '../components/AuthorPage/Header'
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
		firestore.collection("playlists").doc(albumId).onSnapshot(doc => {
			if (doc.exists) {
				setAlbumData(doc.data())
				setHeaderColors(doc.data().imageColors)
			} else {
				console.log("No such document!");
			}
		})
	}

	function fetchSongsInAlbum() {
		setPlaylistSongs([])
		if (albumData.length !== 0) {
			albumData.songs.map(async songId => {
				let albumSong = (await firestore.collection('songs').doc(songId).get()).data()
				setPlaylistSongs(prev => [...prev, albumSong])
			})
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAlbumsData()
	}, [albumId, firestore])

	useEffect(() => {
		fetchSongsInAlbum()
	}, [albumData])

	return (
		<div className="AlbumPage" style={{ animation: 'zoomIn .2s forwards' }}>
			{
				loading ? <LoadingCircle top={'50%'} /> :
					<>
						<Header data={albumData} headerColors={headerColors} setHeaderColors={setHeaderColors} />
						<SongList listOfSongs={playlistSongs} source={{ source: `/albums/${albumData.id}`, name: albumData.name, image: albumData.image, songsList: playlistSongs }} showSearch defaultSearchMode={"songs"} />
					</>
			}

		</div>
	)
}
