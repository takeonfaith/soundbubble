import React, { useEffect, useState } from 'react'
import { Loading } from './Loading'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { songs } from '../../data/songs'
import { useAuth } from '../../functionality/AuthContext'
import { firestore } from '../../firebase'
import { Slider } from '../Tools/Slider'
import {BiCheckCircle, BiDownArrow, BiUpArrow} from 'react-icons/bi'
import { FiXCircle } from 'react-icons/fi'
export const Lyrics = () => {
	const { setIsThereKaraoke, currentSongData, setCurrentSongData, isThereKaraoke, currentParagraph, displayAuthors, changeCurrentTime, play, currentTime, currentParagraphRef, currentSong, lyrics } = useSong()
	const { currentUser } = useAuth()
	const [inputKaraokeTime, setInputKaraokeTime] = useState(0)
	const [karaokeModeratorTimes, setKaraokeModeratorTimes] = useState([])
	const [lyricsModeratorMode, setLyricsModeratorMode] = useState(0)
	const [canUpdateLyrics, setCanUpdateLyrics] = useState(false)
	const isModerator = currentUser.email === 'takeonfaith6@gmail.com'
	function inputKaraoke(e, index) {
		// console.log("ewqewqewq")
		let tempArray = karaokeModeratorTimes
		let convertedToNumber = e.target.value
		tempArray[index] = convertedToNumber
		setInputKaraokeTime(e.target.value)
		setKaraokeModeratorTimes(tempArray)
	}

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
				isModerator ?
					<Slider pages={['Listen mode', 'Edit Mode']} currentPage={lyricsModeratorMode} setCurrentPage={setLyricsModeratorMode} /> :
					null
			}
			{
				isThereKaraoke ?
					lyrics.map((el, i) => {
						return (
							<div className="lyricsBlock" key={i} onClick={(e) => changeCurrentTime(e, el.startTime)} style={play ? currentParagraph === i ? {} : Math.abs(currentParagraph - i) < 2 ? { opacity: .5, filter: 'blur(1px)' } : { opacity: .2, filter: 'blur(2px)' } : {}} ref={currentParagraph === i ? currentParagraphRef : null} >
								{
									lyricsModeratorMode === 1 ?
									<div className="lyricsBlockInput">
										<span onClick={e => e.stopPropagation()}>{karaokeModeratorTimes[i] !== undefined && karaokeModeratorTimes[i].length !== 0?<BiCheckCircle style = {{background:'var(--themeColor3)', color:'var(--themeColor)'}}/>:<FiXCircle/>} </span>
										<input type="number"  value={karaokeModeratorTimes[i] || inputKaraokeTime} onChange={(e) => inputKaraoke(e, i)} onClick={e => e.stopPropagation()} /> 
										<div className="addLyricsElementBtns" onClick={e => e.stopPropagation()}>
											<button onClick = {()=>{addLyricsBlock(i, 'up')}}><BiUpArrow/></button>
											<button onClick = {()=>{addLyricsBlock(i, 'down')}}><BiDownArrow/></button>
										</div>
									</div>:
									null
								}
								{
									el.text === "@loading" ?
										<Loading currentTime={currentTime - lyrics[i].startTime} timeSpan={lyrics[i + 1].startTime - lyrics[i].startTime} />
										:
										el.text === "@end" ? <></>
											:
											<p key={i} style={currentParagraph === i ?
												{} : window.innerWidth > 1000 ?
													Math.abs(currentParagraph - i) < 2 ?
														{ transform: 'scale(.8) translateX(-58px)' } : { transform: 'scale(.75) translateX(-78px)' } :
													Math.abs(currentParagraph - i) < 2 ?
														{ transform: 'scale(.8) translateX(-11.5%)' } : { transform: 'scale(.75) translateX(-15.6%)' }}>{el.text}</p>
								}

							</div>

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
