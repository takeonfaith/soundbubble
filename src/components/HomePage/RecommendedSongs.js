import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import {useSong} from '../../functionality/SongPlay/SongContext'
import { SongList } from '../Basic/SongList'
import { TitleWithMoreBtn } from '../Basic/TitleWithMoreBtn'
import { SongItem } from '../FullScreenPlayer/SongItem'
export const RecommendedSongs = () => {
	const {yourAuthors} = useSong()
	const {currentUser} = useAuth()
	const [recommendedSongs, setRecommendedSongs] = useState([])
	
	function fetchRecommendedSongs(){
		const tempSongsIds = []
		yourAuthors.forEach((author, i) => {
			author.ownSongs.forEach(async (songId)=>{
				let songData = (await firestore.collection('songs').doc(songId).get()).data()
				if(!currentUser.addedSongs.includes(songId) && !tempSongsIds.includes(songData.id)){
					setRecommendedSongs(prev=>[...prev, songData])
					tempSongsIds.push(songData.id)
				}
			})
		})
		// tempSongArray.sort((songA, songB)=>songB.listens - songA.listens)
		
	}

	useEffect(() => {
		fetchRecommendedSongs()
	}, [])
	return (
		<div className = 'RecommendedSongs'>
			{/* <TitleWithMoreBtn title = {"Recomme"}/> */}
			<SongList listOfSongs = {recommendedSongs} source = {{source: `/home`, name: "Recommended Songs", image: "", songsList: recommendedSongs}} title = {"Recommended Songs"}/>
		</div>
	)
}
