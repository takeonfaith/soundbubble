import React, { useEffect, useState } from 'react'
import { Loading } from './Loading'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { songs } from '../../data/songs'
import { useAuth } from '../../functionality/AuthContext'
import { firestore } from '../../firebase'
export const Lyrics = () => {
	const {setIsThereKaraoke, currentSongData, setCurrentSongData, isThereKaraoke, currentParagraph, displayAuthors, changeCurrentTime, play, currentTime, currentParagraphRef, currentSong, lyrics } = useSong()
	const {currentUser} = useAuth()
	const [inputKaraokeTime, setInputKaraokeTime] = useState(0)
	const [karaokeModeratorTimes, setKaraokeModeratorTimes] = useState([])
	function inputKaraoke(e, index){
		// console.log("ewqewqewq")
		let tempArray = karaokeModeratorTimes
		let convertedToNumber = e.target.value
		tempArray[index] = convertedToNumber
		setInputKaraokeTime(e.target.value)
		setKaraokeModeratorTimes(tempArray) 
	}

	useEffect(() => {
		let tempSongData = currentSongData
		// console.log(tempSongData)
		if(tempSongData !== undefined && inputKaraokeTime !== 0){
			tempSongData.lyrics.forEach((paragraph, index) => {
				paragraph.startTime = karaokeModeratorTimes[index] || index * 2
			})
			setCurrentSongData(tempSongData)
			setIsThereKaraoke(true)
		}
	}, [inputKaraokeTime])
	function updateLyrics(){
		//TODO: add if statement to prevent adding lyrics time spans to not everysingle paragraph block
		firestore.collection('songs').doc(currentSongData.id).update({
			lyrics:currentSongData.lyrics
		})
	}

	return (
		<div className={"Lyrics " + (currentUser.email === 'takeonfaith6@gmail.com'?"moderator":"")}>
			{
				isThereKaraoke ?
					lyrics.map((el, i) => {
						return (
							<div className="lyricsBlock" key={i} onClick={(e) => changeCurrentTime(e, el.startTime)} style={play ? currentParagraph === i ? {} : Math.abs(currentParagraph - i) < 2 ? { opacity: .5, filter: 'blur(1px)' } : { opacity: .2, filter: 'blur(2px)' } : {}} ref={currentParagraph === i ? currentParagraphRef : null} >
								<input type="number" className = "lyricsBlockInput" value = {karaokeModeratorTimes[i] || el.startTime || inputKaraokeTime} onChange = {(e)=>inputKaraoke(e, i)} onClick = {e=>e.stopPropagation()}/>
								{
									el.text === "@loading" ?
										<Loading currentTime={currentTime - lyrics[i].startTime} timeSpan={lyrics[i + 1].startTime - lyrics[i].startTime} />
										:
										el.text === "@end" ? <></>
											:
											<p key={i} style={currentParagraph === i ? 
												{} : window.innerWidth > 1000?
												Math.abs(currentParagraph - i) < 2 ? 
												{ transform: 'scale(.8) translateX(-58px)' } : { transform: 'scale(.75) translateX(-78px)' }:
												Math.abs(currentParagraph - i) < 2 ? 
												{ transform: 'scale(.8) translateX(-11.5%)' } : { transform: 'scale(.75) translateX(-15.6%)' }}>{el.text}</p>
								}
								
							</div>

						)
					}) :
					lyrics.map((el, i) => {
						return (
							<div className="lyricsBlock" key={i}>
								<input type="number" className = "lyricsBlockInput" value = {karaokeModeratorTimes[i] || el.startTime || 0} onChange = {(e)=>inputKaraoke(e, i)} onClick = {e=>e.stopPropagation()}/>
								{
									<p>{el.text}</p>
								}
							</div>

						)
					})
			}
			<h6 className={"lyricsAuthors " + (currentParagraph === lyrics.length - 1 ? "active" : "")}>Authors:  {displayAuthors()}</h6>
			<button onClick = {updateLyrics}>Update Lyrics</button>
		</div>
	)
}
