import React, { useEffect, useState } from 'react'

import { useSong } from '../../contexts/SongContext'
import { useAuth } from '../../contexts/AuthContext'
import { firestore } from '../../firebase'
import { Slider } from '../Tools/Slider'
import {BiCheckCircle, BiDownArrow, BiUpArrow} from 'react-icons/bi'
import { FiXCircle } from 'react-icons/fi'
import { LyricsParagraph } from './LyricsParagraph'
export const Lyrics = () => {
	const { setIsThereKaraoke, currentSongData, setCurrentSongData, isThereKaraoke, currentParagraph, displayAuthors, changeCurrentTime, play, currentTime, currentParagraphRef, currentSong, lyrics, rightSideCurrentPage, openFullScreenPlayer, openMenu } = useSong()
	const { currentUser } = useAuth()
	const [inputKaraokeTime, setInputKaraokeTime] = useState(0)
	const [karaokeModeratorTimes, setKaraokeModeratorTimes] = useState([])
	const [lyricsModeratorMode, setLyricsModeratorMode] = useState(0)
	const [canUpdateLyrics, setCanUpdateLyrics] = useState(false)
	useEffect(() => {
		if (isThereKaraoke && (openMenu && rightSideCurrentPage === 2) && openFullScreenPlayer) currentParagraphRef.current.scrollIntoView()
	}, [currentParagraph])
	function inputKaraoke(e, index) {
		// console.log("ewqewqewq")
		let tempArray = karaokeModeratorTimes
		let convertedToNumber = e.target.value
		tempArray[index] = convertedToNumber
		setInputKaraokeTime(e.target.value)
		setKaraokeModeratorTimes(tempArray)
	}

	// console.log(karaokeModeratorTimes)

	useEffect(() => {
		if(lyrics[0] && lyrics[0].startTime !== 'undefined'){
			lyrics.forEach(paragraph => {
				karaokeModeratorTimes.push(paragraph.startTime)
			});
			setCanUpdateLyrics(true)
		}
	}, [])

	useEffect(() => {
		let tempSongData = currentSongData
		// console.log(tempSongData)
		if (tempSongData !== undefined && inputKaraokeTime !== 0) {
			tempSongData.lyrics.forEach((paragraph, index) => {
				paragraph.startTime = karaokeModeratorTimes[index] || 'undefined'
			})
			setCurrentSongData(tempSongData)
			setIsThereKaraoke(true)
		}

		if(!currentSongData.lyrics.some(paragraph=>paragraph.startTime === 'undefined')) setCanUpdateLyrics(true)
		else setCanUpdateLyrics(false)
	}, [inputKaraokeTime])
	function updateLyrics() {
		//TODO: add if statement to prevent adding lyrics time spans to not everysingle paragraph block
		firestore.collection('songs').doc(currentSongData.id).update({
			lyrics: currentSongData.lyrics
		})
	}

	// console.log(currentSongData)

	function addLyricsBlock(indexOfRelativeElement, direction){		
		const tempTimes = karaokeModeratorTimes
		if(direction === 'down'){
			tempTimes.splice(indexOfRelativeElement + 1, 0, undefined)
			setKaraokeModeratorTimes(tempTimes)
			return currentSongData.lyrics.splice(indexOfRelativeElement + 1, 0, {startTime:"undefined", text:"@loading"})
		}
		
		tempTimes.splice(indexOfRelativeElement, 0, undefined)
		setKaraokeModeratorTimes(tempTimes)
		currentSongData.lyrics.splice(indexOfRelativeElement, 0, {startTime:"undefined", text:"@loading"})
	}

	return (
		<div className="Lyrics">
			{
				currentUser.isAdmin ?
					<Slider pages={['Listen mode', 'Edit Mode']} currentPage={lyricsModeratorMode} setCurrentPage={setLyricsModeratorMode} /> :
					null
			}
			{
				isThereKaraoke ?
					lyrics.map((el, i) => {
						return (
							<LyricsParagraph el = {el} index = {i} lyricsModeratorMode = {lyricsModeratorMode} karaokeModeratorTimes = {karaokeModeratorTimes} setKaraokeModeratorTimes = {setKaraokeModeratorTimes} setInputKaraokeTime = {setInputKaraokeTime} inputKaraokeTime = {inputKaraoke}/>
						)
					}) :
					lyrics.map((el, i) => {
						return (
							<div className="lyricsBlock" key={i}>
								{
									lyricsModeratorMode === 1 ?
									<div className="lyricsBlockInput">
										{karaokeModeratorTimes[i] !== undefined && karaokeModeratorTimes[i].length !== 0?<BiCheckCircle style = {{background:'var(--themeColor3)', color:'var(--themeColor)'}}/>:<FiXCircle/>} 
										<input type="number"  value={karaokeModeratorTimes[i] || inputKaraokeTime} onChange={(e) => inputKaraoke(e, i)} onClick={e => e.stopPropagation()} /> 
										<div className="addLyricsElementBtns">
											<button onClick = {()=>addLyricsBlock(i, 'up')}><BiUpArrow/></button>
											<button onClick = {()=>addLyricsBlock(i, 'down')}><BiDownArrow/></button>
										</div>
									</div>:
									null
								}
								<p>{el.text}</p>
							</div>

						)
					})
			}
			<h6 className={"lyricsAuthors " + (currentParagraph === lyrics.length - 1 ? "active" : "")}>Authors:  {displayAuthors()}</h6>
			{
				lyricsModeratorMode === 1 ?
					<button onClick={canUpdateLyrics?updateLyrics:null} className="updateLyricsBtn" style = {!canUpdateLyrics?{opacity:0.3}:{}}>Update Lyrics</button> :
					null
			}
		</div>
	)
}
