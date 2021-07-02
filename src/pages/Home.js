import '../styles/HomePage.css'
import { MainBanner } from '../components/HomePage/MainBanner'
import { RecentSongs } from '../components/HomePage/RecentSongs'
import { RecommendedAuthors } from '../components/HomePage/RecommendedAuthors'
import { RecommendedSongs } from '../components/HomePage/RecommendedSongs'
import { firestore } from '../firebase'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../functionality/AuthContext'
import { SongList } from '../components/Basic/SongList'
import { SongItem } from '../components/FullScreenPlayer/SongItem'
import { DefaultPlaylists } from '../components/HomePage/DefaultPlaylists'
export const Home = () => {
	const [songList, setSongList] = useState([])
	const {currentUser} = useAuth()
	function fetchData(){
		console.log(currentUser.lastQueue.songsList)
		currentUser.lastQueue.songsList.forEach(async songId=>{
			let songData = (await firestore.collection('songs').doc(songId).get()).data()
			setSongList(prev=>[...prev, songData])
		})
	}
	useEffect(() => {
		fetchData()
	}, [])
return (
	<div style={{ animation: 'zoomIn .2s forwards' }} className="HomePage">
		<MainBanner />
		<RecommendedSongs/>
		<RecommendedAuthors/>
		{/* <DefaultPlaylists/> */}
		<RecentSongs/>
	</div>
)
}
