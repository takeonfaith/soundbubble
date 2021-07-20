import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Header } from '../components/AuthorPage/Header'
import { firestore } from '../firebase'
import { LoadingCircle } from '../components/Loading/LoadingCircle'
import { SongList } from '../components/Lists/SongList'
import { useHistory } from 'react-router-dom'
import { fetchItemsList } from '../functions/fetch/fetchItemsList'
export const AlbumPage = () => {
	const match = useRouteMatch('/albums/:albumId')
	const [playlistSongs, setPlaylistSongs] = useState([])
	const [headerColors, setHeaderColors] = useState([])
	const { albumId } = match.params
	const [albumData, setAlbumData] = useState([])
	const [loading, setLoading] = useState(true)
	const history = useHistory()
	async function fetchAlbumsData() {
		firestore.collection("playlists").doc(albumId).onSnapshot(doc => {
			if (doc.exists) {
				setAlbumData(doc.data())
				setHeaderColors(doc.data().imageColors)
			} else {
				history.push('/not-found')
			}
		})
	}

	function fetchSongsInAlbum() {
		if(albumData.songs?.length) fetchItemsList(albumData.songs, 'songs', setPlaylistSongs, (res)=>res, ()=>setLoading(false))
		else setLoading(false)
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
