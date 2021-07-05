import React, { useEffect, useState } from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { ContentRouter } from '../../routers/ContentRouter'
import { FullBottomSide } from '../Mobile/FullBottomSide'
import FullScreenPlayer from './FullScreenPlayer'
import { LeftsideBar } from './LeftsideBar'
import { ModalWindow } from './ModalWindow'
import '../../styles/FullScreenPlayer.css'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import { useScreen } from '../../functionality/ScreenContext'

export const ContentWrapper = () => {
	const { songRef, loadSongData, playing, songSrc, openFullScreenPlayer } = useSong()
	const {isMobile, screenHeight} = useScreen()
	const {currentUser} = useAuth()
	const fiveMinutes = 300000 // ten minutes, or whatever makes sense for your app
	const [intervalExciter, setIntervalExciter] = useState(true)
	// "maintain connection"
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


	return (
		<>
			<audio src={songSrc} ref={songRef} onLoadedData={loadSongData} onTimeUpdate={playing} ></audio>
			<div className={"Wrapper " + (openFullScreenPlayer?"turnedOff":"")} style = {isMobile?{height:screenHeight}:{height:"100vh"}}>
				{!isMobile ? <LeftsideBar /> : window.location.hash.substr(2, 4) === 'chat' && window.location.hash.length > 6?null:<FullBottomSide />}
				<div className="Content">
					<ContentRouter />
				</div>
				<ModalWindow />
			</div>
			<FullScreenPlayer />
		</>
	)
}
