import React, { useEffect, useState } from 'react'
import { PlaylistItem } from '../components/AuthorPage/PlaylistItem'
import { SongItem } from '../components/FullScreenPlayer/SongItem'
import { playlists } from '../data/playlists'
import { authors } from '../data/authors'
import { useSong } from '../functionality/SongPlay/SongContext'
import findSimilarArtists from '../functions/findSimilarArtists'
import { AuthorItemBig } from '../components/AuthorPage/AuthorItemBig'
import findIfSongIsNew from '../functions/findIfSongIsNew'
import '../styles/HomePage.css'
import { songs } from '../data/songs'
import { MainBanner } from '../components/HomePage/MainBanner'
export const Home = () => {
	// const {setCurrentSongQueue} = useSong()
	// const [homePlaylists, setHomePlaylists] = useState([])
	// useEffect(() => {
	// 	setHomePlaylists(playlists.allPlaylists.filter(playlist => playlists['Soundbubble'].includes(playlist.id)) ) 
	// }, [])
	const { yourSongs } = useSong()
	const [interestingAuthors, setInterestingAuthors] = useState([])
	const [recommendationAuthors, setRecommendationAuthors] = useState([])
	const [recentSongs, setRecentSongs] = useState([])
	function findAddedToLibraryAuthors() {
		yourSongs.forEach((song) => {
			if (interestingAuthors.findIndex(author => song.authors.includes(author))) {
				setInterestingAuthors(prevAuthor => new Set([...prevAuthor, song.authors].flat()))
			}
		})
		setInterestingAuthors(prevArr => Array.from(prevArr))
	}

	function findRecentSongs(){
		const tempSongsArray = []
		console.log()
		interestingAuthors.forEach((author, i) => {
			songs['allSongs'].forEach((song, i) => {
				if (song.authors.includes(author)) {
					if(author.name === 'Denzel Curry') console.log(song)
					if(findIfSongIsNew(song) && !tempSongsArray.includes(song)) {
						tempSongsArray.push(song)
					}
				}
			})
		})
		setRecentSongs(tempSongsArray)
	}

	useEffect(() => {
		findAddedToLibraryAuthors()
	}, [])

	useEffect(() => {
		interestingAuthors.forEach((author) => {
			setRecommendationAuthors(prevRecommend => [...prevRecommend, findSimilarArtists(author, () => null)])
		})
		setRecommendationAuthors(prevArr => Array.from(new Set(prevArr.flat())))
		setRecommendationAuthors(prevArr => prevArr.sort((author1, author2)=>author2.numberOfListenersPerMonth - author1.numberOfListenersPerMonth))
		setRecommendationAuthors(prevArr=>prevArr.filter(author=>!interestingAuthors.includes(author.name)))
	}, [interestingAuthors])

	useEffect(() => {
		findRecentSongs()
	}, [recommendationAuthors])
	return (
		<div style={{ animation: 'zoomIn .2s forwards' }} className="HomePage">
			{/* {recommendationAuthors.length?<MainBanner person = {recommendationAuthors[0]}/>:null}
			<h2>Recommended Authors</h2>
			<div className="artistsWrapper">
				{recommendationAuthors.map((author, index) => {
					return (
						<AuthorItemBig data={author} key={index} />
					)
				})}
			</div>
			<div>
				<h2>New Songs</h2>
				{recentSongs.map((song, index)=>{
					return <SongItem song = {song} localIndex = {index} isNewSong = {true}/>
				})}
			</div> */}
		</div>
	)
}
