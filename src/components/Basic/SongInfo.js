import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import displayDate from '../../functions/displayDate'
export const SongInfo = ({song}) => {
	const {displayAuthors} = useSong()
	return (
		<div className = 'SongInfo'>
			<div className="songImage">
				<img src={song.cover} alt="" />
			</div>
			<h4>{song.name}</h4>
			<span>{displayAuthors(song.authors, ', ')}</span>
			<p>{song.listens} listens</p>
			<span>Released {displayDate(song.releaseDate)}</span>
		</div>
	)
}
