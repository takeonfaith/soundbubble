import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import { CgEditMarkup } from 'react-icons/cg'
import { Link } from 'react-router-dom'
import { playlists } from '../../data/playlists'
import { songs } from '../../data/songs'
import checkNumber from '../../functions/checkNumber'
import normalizeString from '../../functions/normalizeString'
import shuffleSongs from '../../functions/shuffleSongs'

const SongContext = createContext(null)

export const useSong  = () =>{
	return useContext(SongContext)
}

export const SongProvider = ({children}) => {
	const [yourSongs, setYourSongs] = useState(songs["Kostya Doloz"].map((songId)=>songs['allSongs'][songId]))
	const [yourPlaylists, setYourPlaylists] = useState(playlists["Kostya Doloz"].map((playlistId)=>playlists['allPlaylists'][playlistId]))
	const [currentSongQueue, setCurrentSongQueue] = useState(yourSongs)
	const [currentSong, setCurrentSong] = useState(0)
	const [currentSongInQueue, setCurrentSongInQueue] = useState(0)
	const [currentSongPlaylistSource, setCurrentSongPlaylistSource] = useState({source:'library', name:'Your Library', image:'https://sun9-66.userapi.com/impf/c636628/v636628089/46fc5/jZmb1Eadwqs.jpg?size=960x1280&quality=96&sign=ee424378e70207bd5f8ab2aa5a669b81&type=album', songsList:yourSongs})
	const {lyrics, songSrc, authors } = songs['allSongs'][currentSong]
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

	function checkKaraoke() {
		if (!lyrics && lyrics[0].startTime === undefined) {
		  return false
		}
  
		return true
	 }
  
	 useEffect(() => {
		setIsThereKaraoke(checkKaraoke())
	 }, [lyrics])

	 useEffect(() => {
		 if(shuffleMode){
			 let shuffledSongsArray = shuffleSongs(currentSongQueue)
			 setCurrentSongQueue(shuffledSongsArray) 
			 setCurrentSongInQueue(shuffledSongsArray.findIndex(song => song.id === currentSong))
		 }
		 else {
			 setCurrentSongQueue(currentSongPlaylistSource.songsList)
			 setCurrentSongInQueue(currentSongPlaylistSource.songsList.findIndex(song => song.id === currentSong))
		 }
	 }, [shuffleMode])
  
	 function playSong() {
		if (play) songRef.current.pause()
		else songRef.current.play()
  
		setPlay(!play)
	 }
  
	 function loadSongData(e) {
		setCurrentTime(e.target.currentTime);
		setSongDuration(e.target.duration)
		inputRef.current.max = e.target.duration
		leftSideBarInputRef.current.max = e.target.duration
		document.documentElement.style
		  .setProperty('--inputRange', 0 + '%');
		if (play) { e.target.play() }
		else e.target.pause()
	 }
  
	 function defineCurrentParagraph() {
		lyrics.find((el, i) => {
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
			  if(currentSongQueue.length === 1){
					prevSong()
					return songRef.current.play()
			  }
			 return nextSong()
		  }
		  prevSong()
		  songRef.current.play()
		}
		setCurrentTime(event.target.currentTime)
		if (isThereKaraoke && rightSideCurrentPage === 2 && openFullScreenPlayer) defineCurrentParagraph()
		document.documentElement.style
		  .setProperty('--inputRange', (event.target.currentTime / songDuration) * 100 + '%');
	 }
  
	 function nextSong() {
		let correctSongNumber = checkNumber(currentSongInQueue + 1, currentSongQueue.length - 1)
		let currentSongId = songs['allSongs'][currentSongQueue[correctSongNumber].id].id
		setCurrentParagraph(0)
		setCurrentSong(currentSongId)
		setCurrentSongInQueue(checkNumber(correctSongNumber, currentSongQueue.length - 1))
	 }
  
	 function prevSong() {
  
		if (currentTime > 5) {
		  songRef.current.currentTime = 0
		  setCurrentTime(0)
		  return
		}
		let correctSongNumber = checkNumber(currentSongInQueue - 1, currentSongQueue.length - 1)
		let currentSongId = songs['allSongs'][currentSongQueue[correctSongNumber].id].id
		setCurrentParagraph(0)
		setCurrentSong(currentSongId)
		setCurrentSongInQueue(checkNumber(correctSongNumber, currentSongQueue.length - 1))
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
  
	 function displayAuthors(authorsList = authors, separatingSign = " & ") {
		return (
		  authorsList.map((el, i) => {
			 return <><Link to={`/authors/${normalizeString(el)}`} key={i} onClick = {(e)=>{e.stopPropagation();setOpenFullScreenPlayer(false)}}>{el}</Link>{(i === authorsList.length - 1 ? "" : separatingSign)}</>
		  })
		)
	 }
	 function findLen() {
		let str = ""
		authors.forEach(el => {
		  str += el
		})
		return str.length
	 }
	return (
		<SongContext.Provider value = {
			{
				yourSongs,
				setYourSongs,
				yourPlaylists,
				currentSongQueue,
				currentSongPlaylistSource,
				setCurrentSongPlaylistSource,
				setCurrentSongQueue,
				setCurrentSongInQueue,
				play,
            setPlay,
				songSrc,
            currentTime,
            setCurrentTime,
            songDuration,
            songRef, 
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
				findLen
			}
		}>
			{children}
		</SongContext.Provider>
	)
}
