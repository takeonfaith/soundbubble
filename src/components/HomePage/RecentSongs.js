import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase'
import { useSong } from '../../functionality/SongPlay/SongContext'
import findIfSongIsNew from '../../functions/findIfSongIsNew'
import { SongList } from '../Basic/SongList'
import { SongItem } from '../FullScreenPlayer/SongItem'

export const RecentSongs = () => {
	const { yourAuthors } = useSong()
	const [recentSongs, setRecentSongs] = useState([])
	function findRecentSongs(){
		const tempSongsIds = []
		yourAuthors.forEach((author, i) => {
			author.ownSongs.forEach(async songId=>{
				let songData = (await firestore.collection('songs').doc(songId).get()).data()
				if(findIfSongIsNew(songData) && !tempSongsIds.includes(songData.id)){
					setRecentSongs(prev=>[...prev, songData])
					tempSongsIds.push(songData.id)
				}
			})
		})
	}

	useEffect(() => {
		if(yourAuthors !== undefined && yourAuthors.length !== 0 && recentSongs.length === 0) findRecentSongs()
	}, [])
	return (
		<div>
			<SongList listOfSongs = {recentSongs} source = {{source: `/home`, name: "New Songs", image: "", songsList: recentSongs}} title = {"New Songs"} isNewSong/>
		</div>
	)
}
