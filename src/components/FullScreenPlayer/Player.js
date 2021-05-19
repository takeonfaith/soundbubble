import React from 'react'
import { ColorExtractor } from 'react-color-extractor'
import { FaBackward, FaForward, FaPause, FaPlay } from 'react-icons/fa'
import { TiArrowRepeat, TiArrowShuffle } from 'react-icons/ti'
import { songs } from '../../data/songs'
import { useSong } from '../../functionality/SongPlay/SongContext'
import checkNumber from '../../functions/checkNumber'
import correctTimeDisplay from '../../functions/correctTimeDisplay'
import { ColorCircles } from './colorCircles'

export const Player = ({inputRef, textLimit = 18}) => {
	const { 
		findLen,  
		currentTime, 
		changeCurrentTime, 
		songDuration, 
		setRepeatMode, 
		repeatMode, 
		play, 
		prevSong, 
		playSong, 
		nextSong, 
		setShuffleMode, 
		shuffleMode, 
		displayAuthors,
		name, 
		authors, 
		cover} = useSong()
	return (
		<div className="player">
			<div className="playerUpperSide">
				<div className="songCover">
					<img src={cover} alt="" />
				</div>
				<div className = "nameAndAuthors">
					<h2 title={name.length > textLimit ? name : null} style={{ overflow: 'hidden' }}>
						<div style={name.length > textLimit ? { animation: 'outSideText 17s infinite', whiteSpace: 'nowrap' } : {}}>{name}</div>
					</h2>
					<h3 title={authors.map((el) => ' ' + el.displayName)} style={{ overflow: 'hidden' }}>
						<div style={findLen() > textLimit ? { animation: 'outSideText 17s infinite', whiteSpace: 'nowrap' } : {}}>{displayAuthors()}</div>
					</h3>
				</div>
			</div>
			<div className="controlPanel">
				<input type="range" name="" id="" min="0" ref={inputRef} step="1" value={currentTime} onChange={changeCurrentTime} />
				<div className="startAndEndTime">
					<span>{correctTimeDisplay(currentTime)}</span>
					<span>{correctTimeDisplay(songDuration)}</span>
				</div>
				<div className="btns">
					<button className="shuffleBtn" onClick={() => setShuffleMode(checkNumber(shuffleMode + 1, 1))} style={shuffleMode ? { background: 'var(--transparentWhite)' } : {}}>
						<TiArrowShuffle style={shuffleMode ? { color: 'var(--themeColor)' } : {}} />
					</button>
					<button onClick={prevSong}><FaBackward /></button>
					<button onClick={playSong}>{play ? <FaPause /> : <FaPlay />}</button>
					<button onClick={nextSong}><FaForward /></button>
					<button className="repeatBtn" onClick={() => setRepeatMode(checkNumber(repeatMode + 1, 2))} style={repeatMode ? { background: 'var(--transparentWhite)' } : {}}>
						<TiArrowRepeat style={repeatMode ? { color: 'var(--themeColor)' } : {}} />
						<span style={repeatMode === 2 ? { opacity: 1 } : {}}></span>
					</button>
					<ColorCircles play={play} />
				</div>
			</div>
		</div>
	)
}
