import React, { useEffect, useState } from 'react'
import { storage } from '../../firebase'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { ContentRouter } from '../../routers/ContentRouter'
import { BottomControlBar } from '../Mobile/BottomControlBar'
import { FullBottomSide } from '../Mobile/FullBottomSide'
import FullScreenPlayer from './FullScreenPlayer'
import { LeftsideBar } from './LeftsideBar'
import { ModalWindow } from './ModalWindow'

export const ContentWrapper = () => {
	const { songRef, loadSongData, playing, songSrc } = useSong()
	
	return (
		<>
			<audio src={songSrc} ref={songRef} onLoadedData={loadSongData} onTimeUpdate={playing} ></audio>
			<div className="Wrapper">
				{window.innerWidth > 1000?<LeftsideBar />:<FullBottomSide/>}
				<div className="Content">
					<ContentRouter />
				</div>
				{/* <ModalWindow>
				<h2>hey there</h2>
			</ModalWindow>	 */}
			</div>
			<FullScreenPlayer />
		</>
	)
}
