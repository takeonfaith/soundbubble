import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { Player } from '../FullScreenPlayer/Player'
import { BottomControlBar } from './BottomControlBar'

export const FullBottomSide = () => {
	const {setOpenFullScreenPlayer} = useSong()
	return (
		<div className = "FullBottomSide">
			<span onClick = {()=>setOpenFullScreenPlayer(true)}>
				<Player textLimit = {25} linkToAuthors = {false}/>
			</span>
			<BottomControlBar/>
		</div>
	)
}
