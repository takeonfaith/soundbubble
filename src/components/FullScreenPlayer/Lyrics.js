import React from 'react'
import { Loading } from './Loading'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { songs } from '../../data/songs'
export const Lyrics = () => {
	const { isThereKaraoke, currentParagraph, displayAuthors, changeCurrentTime, play, currentTime, currentParagraphRef, currentSong, lyrics } = useSong()
	return (
		<div className="Lyrics">
			{
				isThereKaraoke ?
					lyrics.map((el, i) => {
						return (
							<div className="lyricsBlock" key={i} onClick={(e) => changeCurrentTime(e, el.startTime)} style={play ? currentParagraph === i ? {} : Math.abs(currentParagraph - i) < 2 ? { opacity: .5, filter: 'blur(1px)' } : { opacity: .2, filter: 'blur(2px)' } : {}} ref={currentParagraph === i ? currentParagraphRef : null} >
								{
									el.text === "@loading" ?
										<Loading currentTime={currentTime - lyrics[i].startTime} timeSpan={lyrics[i + 1].startTime - lyrics[i].startTime} />
										:
										el.text === "@end" ? <></>
											:
											<p key={i} style={currentParagraph === i ? {} : Math.abs(currentParagraph - i) < 2 ? { transform: 'scale(.8) translateX(-58px)' } : { transform: 'scale(.75) translateX(-78px)' }}>{el.text}</p>
								}

							</div>

						)
					}) :
					lyrics.map((el, i) => {
						return (
							<div className="lyricsBlock" key={i}>
								{
									<p>{el.text}</p>
								}
							</div>

						)
					})
			}
			<h6 style={{ transform: 'translateX(10px)' }} className={"lyricsAuthors " + (currentParagraph === lyrics.length - 1 ? "active" : "")}>Authors:  {displayAuthors()}</h6>
		</div>
	)
}
