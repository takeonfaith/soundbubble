import React, { useState } from 'react'
import { useEffect } from 'react'
import {BiMusic} from 'react-icons/bi'
import {IoPlayCircleOutline} from 'react-icons/io5'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useSong } from '../../contexts/SongContext'
export const LastSongListened = ({data}) => {
	const [lastSongId, setLastSongId] = useState(data.lastSongPlayed)
	const [songData, setSongData] = useState()
	const {setCurrentSong, currentSong, play, songRef, setPlay, setCurrentSongInQueue } = useSong()
	const {currentUser} = useAuth()

	function fetchLastSong(){
		firestore.collection('songs').doc(lastSongId).get().then(doc=>{
			setSongData(doc.data())
		})
	}

	function fetchLastSongId(){
		firestore.collection('users').doc(data.uid).onSnapshot(doc=>{
			setLastSongId(doc.data().lastSongPlayed)
		})
	}

	function chooseSongItem() {
		setCurrentSong(songData.id)
		firestore.collection('users').doc(currentUser.uid).update({
			lastSongPlayed: songData.id
		})
		setCurrentSongInQueue(0)
		if (songData.id === currentSong && play) {
			songRef.current.pause();
			setPlay(false)
			// clearTimeout(listenCountTimeOut)
			return
		}
		songRef.current.play();
		setPlay(true)
	}

	useEffect(() => {
		fetchLastSong()
	}, [lastSongId])

	// useEffect(() => {
	// 	fetchLastSongId()
	// 	return ()=>fetchLastSongId()
	// }, [firestore])
	return songData !== undefined?(
		<div className = "LastSongListened" onClick = {chooseSongItem}>
			<IoPlayCircleOutline/>
			<span>
				{songData.name}
			</span>
		</div>
	):null
}
