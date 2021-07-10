import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingData } from '../components/Basic/LoadingData'
import { PersonTiny } from '../components/Basic/PersonTiny'
import { firestore } from '../firebase'
import checkNumber from '../functions/checkNumber'
import shuffleSongs from '../functions/shuffleSongs'
import { useRealTimeFetch } from '../hooks/useRealTimeFetch'
import { useAuth } from './AuthContext'
const SongContext = createContext(null)

export const useSong = () => {
	return useContext(SongContext)
}

export const SongProvider = ({ children }) => {
	const { currentUser, loading, setLoading } = useAuth()
	const [yourSongs, setYourSongs] = useState([])
	const [yourPlaylists, setYourPlaylists] = useState([])
	const [yourAuthors, setYourAuthors] = useState([])
	const [yourFriends, setYourFriends] = useState([])
	const [currentSongQueue, setCurrentSongQueue] = useState([])
	const [currentSong, setCurrentSong] = useState(-1)
	const [currentSongInQueue, setCurrentSongInQueue] = useState(0)
	const [currentSongPlaylistSource, setCurrentSongPlaylistSource] = useState({})

	const [currentSongData, setCurrentSongData] = useState({ id: -1 })

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
		if (currentSongData.lyrics !== undefined && currentSongData.lyrics.length === 0) return false

		if (currentSongData.lyrics !== undefined) {
			if (currentSongData.lyrics[0].startTime === 'undefined') return false
		}

		return true
	}

	function fetchYourFriends() {
		setYourFriends([])
		if (currentUser.friends !== undefined) {
			currentUser.friends.forEach(async friendObj => {
				const friend = (await firestore.collection('users').doc(friendObj.uid).get()).data()
				if (friendObj.status === 'added') {
					setYourFriends(prev => [...prev, friend])
				}
			})
		}
	}

	function fetchQueue() {
		setCurrentSongQueue([])
		if (currentUser.lastQueue) {
			currentUser.lastQueue.songsList.forEach(async songId => {
				const songData = (await firestore.collection('songs').doc(songId).get()).data()
				setCurrentSongQueue(prev => [...prev, songData])
			})
			setCurrentSongInQueue(currentUser.lastQueue.songsList.findIndex(songId => songId === currentUser.lastSongPlayed))
		}
	}

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
			const curSong = currentUser.lastSongPlayed || currentUser.addedSongs[0] || tempSongObject.id
			const curQueue = currentUser.lastQueue || { source: '/library', name: 'Your Library', image: currentUser.photoURL, songsList: yourSongs } || []
			setCurrentSong(curSong)
			setCurrentSongPlaylistSource(curQueue)

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
			firestore.collection('songs').doc(currentSong).get().then(doc => {
				if (doc.exists) {
					const songData = doc.data()
					setImgColors(songData.imageColors || [])
					setCurrentSongData(songData)
				}
			})
		}
		else fetchCurrentSongInitial()
	}

	function fetchYourSongs() {
		const tempArray = []
		if (currentUser.addedSongs) {
			currentUser.addedSongs.map((song, i) => {
				firestore.collection("songs").doc(song).get().then((doc) => {
					if (doc.exists) {
						tempArray.unshift(doc.data())
						if (i === currentUser.addedSongs.length - 1) setYourSongs(tempArray)
					} else {
						console.log("No such document!");
					}

					if(i === currentUser.addedSongs.length - 1){
						fetchQueue()
					}
				})
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

		if (currentUser.addedPlaylists) {
			currentUser.addedPlaylists.map((playlistId, i) => {
				const response = firestore.collection("playlists").doc(playlistId)
				response.get().then((doc) => {
					if (doc.exists) {
						setYourPlaylists(prev => [...prev, doc.data()])
					} else {
						console.log("No such document!");
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
				});
			})
		}
	}

	function fetchYourAuthors() {
		setYourAuthors([])
		const tempArray = []
		if (currentUser.addedAuthors) {
			currentUser.addedAuthors.map((authorId, i) => {
				const response = firestore.collection("users").doc(authorId)
				response.get().then((doc) => {
					if (doc.exists) {
						tempArray.unshift(doc.data())
						if (i === currentUser.addedAuthors.length - 1) setYourAuthors(tempArray)
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
		let shouldChangeYourSongs = currentUser.addedSongs && (currentUser.addedSongs.length !== yourSongs.length)
		if (shouldChangeYourSongs) {
			fetchYourSongs()
		}
	}, [currentUser.addedSongs])

	useRealTimeFetch(currentUser, fetchYourPlaylists, currentUser.addedPlaylists && ((currentUser.addedPlaylists.length + currentUser.ownPlaylists.length) !== yourPlaylists.length), [currentUser.addedPlaylists])
	useRealTimeFetch(currentUser, fetchYourFriends, currentUser.friends && (currentUser.friends.filter(obj => obj.status === 'added').length !== yourFriends.length), [currentUser.friends])
	useRealTimeFetch(currentUser, fetchYourAuthors, currentUser.addedAuthors && (currentUser.addedAuthors.length !== yourAuthors.length), [currentUser.addedAuthors])
	// useRealTimeFetch(currentUser, fetchQueue, currentUser.lastQueue && (currentUser.lastQueue.songsList.length !== currentSongQueue.length), [currentUser.lastQueue])
	useRealTimeFetch(currentUser, fetchCurrentSong, currentUser && (currentSongData.id === -1 || (currentSong || currentUser.lastSongPlayed)), [currentSong, currentUser.lastSongPlayed])

	useEffect(() => {

		if (currentUser.uid === undefined) {
			setCurrentSongData({ id: -1 })
			setCurrentSong(-1)
		}
	}, [currentUser.uid])

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
	let listenCountTimeOut = useRef()
	function playSong(e) {
		if (e) e.stopPropagation()
		if (play) {
			songRef.current.pause()
		}
		else {
			songRef.current.play()
		}

		setPlay(!play)
	}

	function updateListenCount() {
		listenCountTimeOut.current = setTimeout(() => {
			console.log('count added')
			let listens = currentSongData.listens
			listens++
			firestore.collection('songs').doc(currentSongData.id).update({
				listens: listens
			})
			if (currentSongPlaylistSource.source.substr(1, 6) === 'albums') {
				console.log('I Updated album listen count')
				const sourceId = currentSongPlaylistSource.source.substr(8, currentSongPlaylistSource.source.length - 8)
				firestore.collection('playlists').doc(sourceId).get().then((res) => {
					let listedData = res.data().listens
					listedData++
					firestore.collection('playlists').doc(sourceId).update({
						listens: listedData
					})
				})
			}
		}, songDuration * 1000 * 0.5)
	}

	useEffect(() => {
		clearTimeout(listenCountTimeOut.current)
		if (play) {
			updateListenCount()
		}
	}, [play, currentSongData.id])

	useEffect(() => {
		setCurrentParagraph(0)
	}, [currentSongData.id])

	function loadSongData(e) {
		setCurrentTime(e.target.currentTime)
		setSongDuration(e.target.duration)
		inputRef.current.max = e.target.duration
		if (window.innerWidth > 1000) leftSideBarInputRef.current.max = e.target.duration
		document.documentElement.style.setProperty('--inputRange', 0 + '%')
		if (play) { e.target.play() }
		else e.target.pause()
	}

	function defineCurrentParagraph() {
		//Well, I'm maybe not a great mathematician or smth, but I want to make this not linear, but binary, hence O(logN)
		// currentSongData.lyrics.find((el, i) => {
		// 	if (el.startTime <= songRef.current.currentTime) {
		// 		setCurrentParagraph(i)
		// 		return false
		// 	}
		// 	// currentParagraphRef.current.scrollIntoView()
		// 	return true
		// })

		let first = 0, last = currentSongData.lyrics.length - 1
		let roundedTime = parseFloat(parseFloat(songRef.current.currentTime).toFixed(1))
		while (first <= last) {
			let midPoint = Math.floor((first + last) / 2)
			let blockStartTime = parseFloat(parseFloat(currentSongData.lyrics[midPoint].startTime).toFixed(1))
			let nextBlockStartTime = midPoint !== currentSongData.lyrics.length - 1 ? parseFloat(parseFloat(currentSongData.lyrics[midPoint + 1].startTime).toFixed(1)) : last
			if (currentSongData.lyrics[midPoint].startTime !== 'undefined') {
				if (roundedTime >= blockStartTime && roundedTime <= nextBlockStartTime) {
					setCurrentParagraph(midPoint)
					break
				}
				else if (blockStartTime < roundedTime) first = midPoint + 1
				else last = midPoint - 1

			}
			else return
		}

	}

	useEffect(() => {
		if (rightSideCurrentPage === 2) defineCurrentParagraph()
	}, [rightSideCurrentPage])

	function defineCurrentParagraphLight() {
		if (currentParagraph !== (currentSongData.lyrics.length - 1) && parseFloat(currentSongData.lyrics[currentParagraph + 1].startTime) <= songRef.current.currentTime) {
			return setCurrentParagraph(currentParagraph + 1)
		}
	}
	function playing(event) {
		setCurrentTime(event.target.currentTime)
		if (isThereKaraoke && rightSideCurrentPage === 2 && openFullScreenPlayer && openMenu) defineCurrentParagraphLight()
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
			setCurrentParagraph(0)
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
			if (isThereKaraoke && rightSideCurrentPage === 2 && openFullScreenPlayer) setCurrentParagraph(parseInt(event.target.id))
			songRef.current.play()
			setPlay(true)
			return
		}
		else {
			setCurrentTime(event.target.value)
			songRef.current.currentTime = event.target.value
			document.documentElement.style
				.setProperty('--inputRange', (event.target.value / songDuration) * 100 + '%');
			if (isThereKaraoke && rightSideCurrentPage === 2 && openFullScreenPlayer) defineCurrentParagraph()
		}

	}

	function displayAuthors(authorsList = currentSongData.authors, separatingSign = " & ") {
		return (
			authorsList.map((el, i) => {
				return <>
					<Link to={`/authors/${el.uid}`} key={el.uid} onClick={(e) => { e.stopPropagation(); setOpenFullScreenPlayer(false) }}>{el.displayName}</Link>{(i === authorsList.length - 1 ? "" : separatingSign)}
				</>
			})
		)
	}

	function displayAuthorsFull(authorsList = currentSongData.authors, separatingSign = " & ") {
		return (
			authorsList.map((el, i) => {
				return <>
					<Link to={`/authors/${el.uid}`} key={el.uid} onClick={(e) => { e.stopPropagation(); setOpenFullScreenPlayer(false) }}>
						<PersonTiny data={el} />
					</Link>
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
				displayAuthorsFull,
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
				checkKaraoke,
				setYourPlaylists,
				yourAuthors,
				setYourAuthors,
				updateListenCount
			}
		}>
			{!loading ?
				children :
				<LoadingData />
			}
		</SongContext.Provider>
	)
}