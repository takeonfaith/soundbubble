import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingData } from '../../components/Basic/LoadingData'
import { PersonTiny } from '../../components/Basic/PersonTiny'
import { firestore } from '../../firebase'
import checkNumber from '../../functions/checkNumber'
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
	const [yourAuthors, setYourAuthors] = useState([])
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
		if (currentSongData.lyrics !== undefined && currentSongData.lyrics.length === 0) return false

		if (currentSongData.lyrics !== undefined) {
			console.log(currentSongData.lyrics.length)
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

	function fetchQueue() {
		setCurrentSongQueue([])
		if(currentUser.lastQueue){
			currentUser.lastQueue.songsList.forEach(async songId=>{
				const songData = (await firestore.collection('songs').doc(songId).get()).data()
				setCurrentSongQueue(prev=>[songData, ...prev])
			})
			setCurrentSongInQueue(currentUser.lastQueue.songsList.findIndex(songId => songId === currentSong))
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
		if (currentUser.addedAuthors) {
			currentUser.addedAuthors.map((authorId, i) => {
				const response = firestore.collection("users").doc(authorId)
				response.get().then((doc) => {
					if (doc.exists) {
						setYourAuthors(prev => [doc.data(), ...prev])
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
			fetchQueue()
			fetchYourAuthors()
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
		console.log('listen Count Update')
		listenCountTimeOut.current = setTimeout(() => {
			console.log('count added')
			let listens = currentSongData.listens
			listens++
			firestore.collection('songs').doc(currentSongData.id).update({
				listens: listens
			})
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
			let dif = roundedTime - blockStartTime
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
		if(rightSideCurrentPage === 2) defineCurrentParagraph()
	}, [rightSideCurrentPage])

	function defineCurrentParagraphLight() {
		if (currentParagraph !== (currentSongData.lyrics.length - 1) && parseFloat(currentSongData.lyrics[currentParagraph + 1].startTime) <= songRef.current.currentTime) {
			// console.log(parseFloat(currentSongData.lyrics[currentParagraph+1].startTime), songRef.current.currentTime)
			return setCurrentParagraph(currentParagraph + 1)
		}
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
						<PersonTiny data = {el}/>
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
				setYourAuthors
			}
		}>
			{!loading ?
				children :
				<LoadingData />
			}
		</SongContext.Provider>
	)
}
