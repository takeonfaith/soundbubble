import React, { useRef } from 'react'
import { useSong } from '../../contexts/SongContext'
import { Loading } from './Loading'
import {BiCheckCircle, BiDownArrow, BiUpArrow} from 'react-icons/bi'
import { FiXCircle } from 'react-icons/fi'
import useOnScreen from '../../hooks/useOnScreen'
export const LyricsParagraph = ({ el, index, lyricsModeratorMode, karaokeModeratorTimes,  setKaraokeModeratorTimes, setInputKaraokeTime, inputKaraokeTime }) => {
	const { currentSongData, currentParagraph, displayAuthors, changeCurrentTime, play, currentTime, currentParagraphRef, lyrics} = useSong()
	const paragraphRef = useRef()
	const isVisible = useOnScreen(currentParagraph === index ? currentParagraphRef : paragraphRef)
	const paragraphStyle = currentParagraph === index ?
	{} : window.innerWidth > 1000 ?
		Math.abs(currentParagraph - index) < 2 ?
			{ transform: 'scale(.8) translateX(-58px)' } : { transform: 'scale(.75) translateX(-78px)' } :
		Math.abs(currentParagraph - index) < 2 ?
			{ transform: 'scale(.8) translateX(-11.5%)' } : { transform: 'scale(.75) translateX(-15.6%)' }

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

	function inputKaraoke(e, index) {
		// console.log("ewqewqewq")
		let tempArray = karaokeModeratorTimes
		let convertedToNumber = e.target.value
		tempArray[index] = convertedToNumber
		setInputKaraokeTime(e.target.value)
		setKaraokeModeratorTimes(tempArray)
	}

	return (
		<div className={"lyricsBlock " + (!isVisible ?"notVisible":"")} key={index} id={index} onClick={(e) => changeCurrentTime(e, el.startTime)} style={play ? currentParagraph === index ? {} : Math.abs(currentParagraph - index) < 2? { opacity: .5} : { opacity: .1} : {}} ref={currentParagraph === index ? currentParagraphRef : paragraphRef} >
			{
				lyricsModeratorMode === 1 ?
					<div className="lyricsBlockInput">
						<span onClick={e => e.stopPropagation()}>{karaokeModeratorTimes[index] !== undefined && karaokeModeratorTimes[index].length !== 0 ? <BiCheckCircle style={{ background: 'var(--themeColor3)', color: 'var(--themeColor)' }} /> : <FiXCircle />} </span>
						<input type="number" value={karaokeModeratorTimes[index] || inputKaraokeTime} onChange={(e) => inputKaraoke(e, index)} onClick={e => e.stopPropagation()} />
						<div className="addLyricsElementBtns" onClick={e => e.stopPropagation()}>
							<button onClick={() => { addLyricsBlock(index, 'up') }}><BiUpArrow /></button>
							<button onClick={() => { addLyricsBlock(index, 'down') }}><BiDownArrow /></button>
						</div>
					</div> :
					null
			}
			{
				el.text === "@loading" ?
					<Loading currentTime={currentTime - lyrics[index].startTime} timeSpan={lyrics[index + 1].startTime - lyrics[index].startTime} id={index} />
					:
					el.text === "@end" ? <></>
						:
						<p key={index} id={index} style={paragraphStyle}>{el.text}</p>
			}

		</div>
	)
}
