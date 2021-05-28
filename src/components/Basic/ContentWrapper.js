import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { ContentRouter } from '../../routers/ContentRouter'
import { FullBottomSide } from '../Mobile/FullBottomSide'
import FullScreenPlayer from './FullScreenPlayer'
import { LeftsideBar } from './LeftsideBar'
import { ModalWindow } from './ModalWindow'
import '../../styles/FullScreenPlayer.css'

export const ContentWrapper = () => {
	const { songRef, loadSongData, playing, songSrc } = useSong()
	
	return (
		<>
			<audio src={songSrc} ref={songRef} onLoadedData={loadSongData} onTimeUpdate={playing} ></audio>
			<div className="Wrapper">
				{window.innerWidth > 1000 ? <LeftsideBar /> : <FullBottomSide />}
				<div className="Content">
					<ContentRouter />
				</div>
				<ModalWindow/>
			</div>
			<FullScreenPlayer />
		</>
	)
}
