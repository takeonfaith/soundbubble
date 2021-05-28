import React, { useEffect, useState } from 'react'
import { PlaylistItem } from '../components/AuthorPage/PlaylistItem'
import { SongItem } from '../components/FullScreenPlayer/SongItem'
import { useSong } from '../functionality/SongPlay/SongContext'
import findSimilarArtists from '../functions/findSimilarArtists'
import { AuthorItemBig } from '../components/AuthorPage/AuthorItemBig'
import findIfSongIsNew from '../functions/findIfSongIsNew'
import '../styles/HomePage.css'
import { MainBanner } from '../components/HomePage/MainBanner'
import { useAuth } from '../functionality/AuthContext'
import { firestore } from '../firebase'
export const Home = () => {
	// const {setCurrentSongQueue} = useSong()
	// const [homePlaylists, setHomePlaylists] = useState([])
	// useEffect(() => {
	// 	setHomePlaylists(playlists.allPlaylists.filter(playlist => playlists['Soundbubble'].includes(playlist.id)) ) 
	// }, [])
	const { yourSongs, yourAuthors, currentSongData } = useSong()
	const [interestingAuthors, setInterestingAuthors] = useState([])
	const [recommendationAuthors, setRecommendationAuthors] = useState([])
	const [recentSongs, setRecentSongs] = useState([])
	const [uniqueAuthors, setUniqueAuthors] = useState([])
	const {currentUser} = useAuth()
	// function findAddedToLibraryAuthors() {
	// 	yourSongs.forEach((song) => {
	// 		if (yourAuthors.findIndex(author => song.authors.includes(author))) {
	// 			setInterestingAuthors(prevAuthor => new Set([...prevAuthor, song.authors].flat()))
	// 		}
	// 	})
	// 	setInterestingAuthors(prevArr => Array.from(prevArr))
	// }

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

	// useEffect(() => {
	// 	findAddedToLibraryAuthors()
	// }, [])

	// useEffect(() => {
	// 	yourAuthors.forEach((author) => {
	// 		setRecommendationAuthors(prevRecommend => [...prevRecommend, findSimilarArtists(author, () => null)])
	// 	})
	// 	setRecommendationAuthors(prevArr => Array.from(new Set(prevArr.flat())))
	// 	setRecommendationAuthors(prevArr => prevArr.sort((author1, author2)=>author2.numberOfListenersPerMonth - author1.numberOfListenersPerMonth))
	// 	setRecommendationAuthors(prevArr=>prevArr.filter(author=>!yourAuthors.includes(author.name)))
	// }, [yourAuthors])

	useEffect(() => {
		if (yourAuthors !== undefined) {
			yourAuthors.forEach((author) => {
				findSimilarArtists(author, setRecommendationAuthors)
			})
		}

		if(yourAuthors !== undefined && yourAuthors.length !== 0 && recentSongs.length === 0){
			findRecentSongs()
		}
	}, [])

	useEffect(() => {
		recommendationAuthors.forEach(author=>{
			const uniqueAuthorsUIDSArray = uniqueAuthors.map(author=>author.uid)
			if(!currentUser.addedAuthors.includes(author.uid) && !uniqueAuthorsUIDSArray.includes(author.uid)){
				setUniqueAuthors(prev=>[...prev, author])
			}
		})
}, [recommendationAuthors])
return (
	<div style={{ animation: 'zoomIn .2s forwards' }} className="HomePage">
		<MainBanner />
		<div>
			<h2>Popular Songs</h2>
			
		</div>
		<div>
			<h2>Recommended Authors</h2>
			<div className="artistsWrapper">
				{uniqueAuthors.map((author, index) => {
					return (
						<AuthorItemBig data={author} key={index} />
					)
				})}
			</div>
		</div>
		<div>
			<h2>New Songs</h2>
			{recentSongs.map((song, index) => {
				return <SongItem song={song} localIndex={index} isNewSong={true} />
			})}
		</div>
		
	</div>
)
}
