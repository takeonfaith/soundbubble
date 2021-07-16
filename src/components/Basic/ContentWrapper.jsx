import React, { useEffect, useState } from 'react'
import { useSong } from '../../contexts/SongContext'
import { ContentRouter } from '../../routers/ContentRouter'
import { FullBottomSide } from '../Mobile/FullBottomSide'
import FullScreenPlayer from './FullScreenPlayer'
import { LeftsideBar } from './LeftsideBar'
import { ModalWindow } from './ModalWindow'
import '../../styles/FullScreenPlayer.css'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useScreen } from '../../contexts/ScreenContext'
import { ConfirmWindow } from '../Windows/ConfirmWindow'
import { useUpdateListenCount } from '../../hooks/useUpdateListenCount'
import { useMediaMetadata } from '../../hooks/useMediaMetadata'

export const ContentWrapper = () => {
	const { songRef, loadSongData, playing, songSrc, openFullScreenPlayer, repeatMode, setPlay, prevSong, currentSongQueue, nextSong, currentSongInQueue} = useSong()
	const { isMobile, screenHeight } = useScreen()
	const { currentUser } = useAuth()
	const fiveMinutes = 300000 // 10min
	const [intervalExciter, setIntervalExciter] = useState(true)
	useMediaMetadata()
	const updateListenCount = useUpdateListenCount()
	useEffect(() => {
		const interval = setInterval(() => {
			firestore.collection('users').doc(currentUser.uid).update({ online: new Date().getTime() })
			setIntervalExciter(!intervalExciter)
		}, fiveMinutes)
		return () => clearInterval(interval);
	}, [intervalExciter]);

	useEffect(() => {
		firestore.collection('users').doc(currentUser.uid).update({ online: new Date().getTime() })
	}, [])

	function audioEnded() {
		if (repeatMode === 0) {
			songRef.current.pause()
			setPlay(false)
			return prevSong()
		}
		else if (repeatMode === 1) {
			if (currentSongQueue.length === 1) {
				prevSong()
				updateListenCount()
				return songRef.current.play()
			}
			return nextSong()
		}
		prevSong()
		updateListenCount()
		songRef.current.play()
	}

	

	return (
		<>
			<audio src={songSrc} ref={songRef} onLoadedData={loadSongData} onTimeUpdate={playing} onEnded={audioEnded}></audio>
			<div className={"Wrapper " + (openFullScreenPlayer ? "turnedOff" : "")} style={isMobile ? { height: screenHeight } : { height: "100vh" }}>
				{!isMobile ? <LeftsideBar /> : window.location.hash.substr(2, 4) === 'chat' && window.location.hash.length > 6 ? null : <FullBottomSide />}
				<div className="Content">
					<ContentRouter />
				</div>
				<ModalWindow />
				<ConfirmWindow/>
			</div>
			<FullScreenPlayer />
		</>
	)
}
