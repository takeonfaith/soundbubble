import React, { useState, useEffect } from 'react'
import { firestore } from '../../firebase'
import findIfSongIsNew from '../../functions/find/findIfSongIsNew'
import { SongList } from '../Lists/SongList'
export const TopSongs = ({ authorId, authorsData, headerColors }) => {
	const [popularSongs, setPopularSongs] = useState([])
	const [newSongs, setNewSongs] = useState([])

	async function findAuthorsSongs() {
		setPopularSongs([])
		const tempArray = []
		if (authorsData.isAuthor) {
			if (authorsData.ownSongs !== undefined && authorsData.ownSongs.length !== 0) {
				authorsData.ownSongs.forEach(async (songId, index)=>{
					const songData = (await firestore.collection("songs").doc(songId).get()).data()
					tempArray.push(songData)
					if (findIfSongIsNew(songData) && !newSongs.includes(songData)) setNewSongs(prevSongs => [...prevSongs, songData])
					if(index === authorsData.ownSongs.length - 1){
						tempArray.sort((a, b) => b.listens - a.listens)
						setPopularSongs(tempArray)
					}
				})
			}
			
		}
		else {
			authorsData.addedSongs.forEach(async (songId, index)=>{
				const songData = (await firestore.collection("songs").doc(songId).get()).data()
				tempArray.unshift(songData)
				if(index === authorsData.addedSongs.length - 1){
					setPopularSongs(tempArray)
				}
			})
		}
	}

	useEffect(() => {
		findAuthorsSongs()
		setNewSongs([])
	}, [authorsData.ownSongs])

	return authorsData.isAuthor ?
		(<div className="TopSongs">
			<SongList listOfSongs={newSongs} source={{ source: `/authors/${authorsData.uid}`, name: authorsData.displayName, image: authorsData.photoURL, songsList: newSongs }} isNewSong />
			<SongList
				listOfSongs={popularSongs}
				source={{ source: `/authors/${authorsData.uid}`, name: authorsData.displayName, image: authorsData.photoURL, songsList: popularSongs }}
				title={"Popular Songs"}
				showListens
				showCount
			/>
		</div>) :
		(
			<SongList
				listOfSongs={popularSongs}
				source={{ source: `/authors/${authorsData.uid}`, name: authorsData.displayName + "'s Library", image: authorsData.photoURL, songsList: popularSongs }}
				title={authorsData.displayName + "'s Library"}
				showListens
				showCount
			/>
		)
}
