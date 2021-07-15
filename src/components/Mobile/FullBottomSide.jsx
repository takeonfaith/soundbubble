import React from 'react'
import { useSong } from '../../contexts/SongContext'
import { Player } from '../FullScreenPlayer/Player'
import { BottomControlBar } from './BottomControlBar'

export const FullBottomSide = () => {
	const { setOpenFullScreenPlayer, inputRange } = useSong()
	return (
		<div className="FullBottomSide">
			<span onClick={() => setOpenFullScreenPlayer(true)}>
				<Player textLimit={25} linkToAuthors={false} />
				<span className="mobileSongRange" style = {{width:inputRange + "%"}}></span>
			</span>
			<BottomControlBar />
		</div>
	)
}
