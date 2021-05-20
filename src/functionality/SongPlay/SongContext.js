import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { CgEditMarkup } from 'react-icons/cg'
import { Link } from 'react-router-dom'
import { LoadingData } from '../../components/Basic/LoadingData'
import { playlists } from '../../data/playlists'
import { songs } from '../../data/songs'
import { firestore } from '../../firebase'
import checkNumber from '../../functions/checkNumber'
import normalizeString from '../../functions/normalizeString'
import shuffleSongs from '../../functions/shuffleSongs'
import { useAuth } from '../AuthContext'

const SongContext = createContext(null)

export const useSong = () => {
	return useContext(SongContext)
}

export const SongProvider = ({ children }) => {
	const { currentUser, loading, setLoading } = useAuth()
	const [yourSongs, setYourSongs] = useState([])
	const [yourPlaylists, setYourPlaylists] = useState([])
	const [yourFriends, setYourFriends] = useState([])
	const [currentSongQueue, setCurrentSongQueue] = useState()
	const [currentSong, setCurrentSong] = useState('')
	const [currentSongInQueue, setCurrentSongInQueue] = useState(0)
	const [currentSongPlaylistSource, setCurrentSongPlaylistSource] = useState({})

	const [currentSongData, setCurrentSongData] = useState({})

	const [imgColors, setImgColors] = useState([])
	const [play, setPlay] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [songDuration, setSongDuration] = useState(0)
	const [repeatMode, setRepeatMode] = useState(1)
	const [shuffleMode, setShuffleMode] = useState(0)
	const [currentParagraph, setCurrentParagraph] = useState(0)
	const [isThereKaraoke, setIsThereKaraoke] = useState(true)
	const [openFullScreenPlayer, setOpenFullScreenPlayer] = useState(false)
	const songRef = useRef(null)
	const currentParagraphRef = useRef(null)
	const inputRef = useRef(null)
	const leftSideBarInputRef = useRef(null)
	const [rightSideCurrentPage, setRightSideCurrentPage] = useState(0)
	const [openMenu, setOpenMenu] = useState(false)


	function checkKaraoke() {
		if (currentSongData.lyrics !== undefined && currentSongData.lyrics.length !== 0) {
			if (currentSongData.lyrics[0].startTime === 'undefined') return false
		}

		return true
	}

	function fetchYourFriends() {
		setYourFriends([])
		if (currentUser.friends !== undefined) {
			console.log(currentUser.friends)
			currentUser.friends.forEach(async friendObj => {
				const friend = (await firestore.collection('users').doc(friendObj.uid).get()).data()
				console.log(friend)
				if (friendObj.status === 'added') {
					setYourFriends(prev => [...prev, friend])
				}
			})
		}
	}

	// async function fetchLastPlayedSong() {
	// 	console.log('ewqeqw')
	// 	let songId = 0
	// 	const userRef = firestore.collection('users').doc(currentUser.uid)
	// 	const lastSong = userRef.get()

	// }

	async function fetchCurrentSongInitial() {

		if (currentUser.uid !== undefined) {
			const tempSongObject = {
				id: -1,
				name: "",
				songSrc: "",
				authors: [],
				cover: "",
				listens: 0,
				releaseDate: "",
				lyrics: [],
				imageColors: []
			}
			const curSong = await (await firestore.collection('users').doc(currentUser.uid).get()).data().lastSongPlayed || (await firestore.collection('users').doc(currentUser.uid).get()).data().addedSongs[0] || tempSongObject.id
			const curQueue = await (await firestore.collection('users').doc(currentUser.uid).get()).data().lastQueue || { source: '/library', name: 'Your Library', image: currentUser.photoURL, songsList: yourSongs } || []
			setCurrentSong(curSong)
			console.log(curSong)
			setCurrentSongPlaylistSource(curQueue)
			setCurrentSongQueue(curQueue.songsList)
			setCurrentSongInQueue(curQueue.songsList.findIndex(song => song.id === curSong))
			if (curSong !== -1) {
				const docRef = firestore.collection('songs').doc(curSong)
				const docData = docRef.get()
					.then(doc => {
						if (doc.exists) {
							const songData = doc.data()
							setCurrentSongData(songData)
							setImgColors(songData.imageColors || [])
							setLoading(false)
						}
					}).catch((error) => {
						console.log("Error getting document:", error);
						setLoading(false)
					});
			}
			else {
				setCurrentSongData(tempSongObject)
				setImgColors([])
				setLoading(false)
			}
		}
	}

	async function fetchCurrentSong() {
		if (currentSong !== -1) {
			const docRef = firestore.collection('songs').doc(currentSong)
			const docData = docRef.get()
				.then(doc => {
					if (doc.exists) {
						const songData = doc.data()
						setImgColors(songData.imageColors || [])
						setCurrentSongData(songData)
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
				});
		}
	}

	function fetchYourSongs() {
		setYourSongs([])
		if (currentUser.addedSongs) {
			currentUser.addedSongs.map((song, i) => {
				const response = firestore.collection("songs").doc(song)
				response.get().then((doc) => {
					if (doc.exists) {
						setYourSongs(prev => [doc.data(), ...prev])
					} else {
						console.log("No such document!");
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
				});
			})
		}
	}

	function fetchYourPlaylists() {
		setYourPlaylists([])
		if (currentUser.ownPlaylists) {
			currentUser.ownPlaylists.map((playlistId, i) => {
				const response = firestore.collection("playlists").doc(playlistId)
				response.get().then((doc) => {
					if (doc.exists) {
						setYourPlaylists(prev => [doc.data(), ...prev])
					} else {
						console.log("No such document!");
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
				});
			})
		}
	}

	useEffect(() => {
		if (currentUser) {
			setLoading(true)
			fetchYourSongs()
			fetchCurrentSongInitial()
			fetchYourPlaylists()
			fetchYourFriends()
		}
	}, [currentUser])

	useEffect(() => {
		if (currentUser && currentSong) {
			fetchCurrentSong()
		}
	}, [currentSong])

	useEffect(() => {
		setIsThereKaraoke(checkKaraoke())
	}, [currentSongData.lyrics])

	useEffect(() => {
		if (!loading) {
			if (shuffleMode) {
				let shuffledSongsArray = shuffleSongs(currentSongQueue)
				setCurrentSongQueue(shuffledSongsArray)
				setCurrentSongInQueue(shuffledSongsArray.findIndex(song => song.id === currentSong))
			}
			else {
				setCurrentSongQueue(currentSongPlaylistSource.songsList)
				setCurrentSongInQueue(currentSongPlaylistSource.songsList.findIndex(song => song.id === currentSong))
			}
		}
	}, [shuffleMode])

	function playSong(e) {
		e.stopPropagation()
		if (play) songRef.current.pause()
		else songRef.current.play()

		setPlay(!play)
	}

	function loadSongData(e) {
		setCurrentTime(e.target.currentTime);
		setSongDuration(e.target.duration)
		inputRef.current.max = e.target.duration
		if (window.innerWidth > 1000) leftSideBarInputRef.current.max = e.target.duration
		document.documentElement.style
			.setProperty('--inputRange', 0 + '%');
		if (play) { e.target.play() }
		else e.target.pause()
	}

	function defineCurrentParagraph() {
		currentSongData.lyrics.find((el, i) => {
			if (el.startTime <= songRef.current.currentTime) {
				setCurrentParagraph(i)
				return false
			}
			currentParagraphRef.current.scrollIntoView()
			return true
		})
	}

	function playing(event) {
		if (event.target.currentTime === songDuration) {
			if (repeatMode === 0) {
				songRef.current.pause()
				setPlay(false)
				return prevSong()
			}
			else if (repeatMode === 1) {
				if (currentSongQueue.length === 1) {
					prevSong()
					return songRef.current.play()
				}
				return nextSong()
			}
			prevSong()
			songRef.current.play()
		}
		setCurrentTime(event.target.currentTime)
		if (isThereKaraoke && rightSideCurrentPage === 2 && openFullScreenPlayer && openMenu) defineCurrentParagraph()
		document.documentElement.style
			.setProperty('--inputRange', (event.target.currentTime / songDuration) * 100 + '%');
	}

	async function nextSong(e) {
		if (e) e.stopPropagation()
		let correctSongNumber = checkNumber(currentSongInQueue + 1, currentSongQueue.length - 1)
		let currentSongId = await (await firestore.collection('songs').doc(currentSongQueue[correctSongNumber].id).get()).data().id
		setCurrentParagraph(0)
		setCurrentSong(currentSongId)
		setCurrentSongInQueue(checkNumber(correctSongNumber, currentSongQueue.length - 1))
		firestore.collection('users').doc(currentUser.uid).update({
			lastSongPlayed: currentSongId
		})
	}

	async function prevSong(e) {
		if (e) e.stopPropagation()
		if (currentTime > 5) {
			songRef.current.currentTime = 0
			setCurrentTime(0)
			return
		}
		let correctSongNumber = checkNumber(currentSongInQueue - 1, currentSongQueue.length - 1)
		let currentSongId = await (await firestore.collection('songs').doc(currentSongQueue[correctSongNumber].id).get()).data().id
		setCurrentParagraph(0)
		setCurrentSong(currentSongId)
		setCurrentSongInQueue(checkNumber(correctSongNumber, currentSongQueue.length - 1))
		firestore.collection('users').doc(currentUser.uid).update({
			lastSongPlayed: currentSongId
		})
	}

	function changeCurrentTime(event, startTime = 0) {
		if (event.target.localName === 'div' || event.target.localName === "p") {
			setCurrentTime(startTime)
			songRef.current.currentTime = startTime
			document.documentElement.style
				.setProperty('--inputRange', (startTime / songDuration) * 100 + '%');
			if (isThereKaraoke && rightSideCurrentPage === 2 && openFullScreenPlayer) defineCurrentParagraph()
			songRef.current.play()
			setPlay(true)
			return
		}
		else {

			setCurrentTime(event.target.value)
			songRef.current.currentTime = event.target.value
			document.documentElement.style
				.setProperty('--inputRange', (event.target.value / songDuration) * 100 + '%');

		}

	}

	function displayAuthors(authorsList = currentSongData.authors, separatingSign = " & ") {
		return (
			authorsList.map((el, i) => {
				return <>
					<Link to={`/authors/${el.uid}`} key={i} onClick={(e) => { e.stopPropagation(); setOpenFullScreenPlayer(false) }}>{el.displayName}</Link>{(i === authorsList.length - 1 ? "" : separatingSign)}
				</>
			})
		)
	}
	function findLen() {
		let str = ""
		currentSongData.authors.forEach(el => {
			str += el.displayName
		})
		return str.length
	}

	useEffect(() => {
		document.title = currentSongData.name || 'Soundbubble'
	}, [currentSongData.name])
	return (
		<SongContext.Provider value={
			{
				yourSongs,
				setYourSongs,
				yourPlaylists,
				yourFriends,
				currentSongQueue,
				currentSongPlaylistSource,
				setCurrentSongPlaylistSource,
				setCurrentSongQueue,
				setCurrentSongInQueue,
				play,
				setPlay,
				songSrc: currentSongData.songSrc,
				currentTime,
				setCurrentTime,
				songDuration,
				songRef,
				name: currentSongData.name,
				authors: currentSongData.authors,
				lyrics: currentSongData.lyrics,
				cover: currentSongData.cover,
				imgColors,
				setImgColors,
				currentSong,
				setCurrentSong,
				repeatMode,
				setRepeatMode,
				shuffleMode,
				setShuffleMode,
				inputRef,
				leftSideBarInputRef,
				isThereKaraoke,
				rightSideCurrentPage,
				currentParagraph,
				currentParagraphRef,
				nextSong,
				prevSong,
				playSong,
				playing,
				defineCurrentParagraph,
				setRightSideCurrentPage,
				changeCurrentTime,
				displayAuthors,
				openFullScreenPlayer,
				setOpenFullScreenPlayer,
				loadSongData,
				findLen,
				fetchYourSongs,
				setOpenMenu,
				openMenu,
				currentSongData,
				setCurrentSongData,
				setIsThereKaraoke,
				checkKaraoke
			}
		}>
			{!loading ?
				children :
				<LoadingData />
			}
		</SongContext.Provider>
	)
}
