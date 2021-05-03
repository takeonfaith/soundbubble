import React from 'react'
import { Link } from 'react-router-dom'
import { useSong } from '../../functionality/SongPlay/SongContext'
import normalizeString from '../../functions/normalizeString'
import shortWord from '../../functions/shortWord'
import { SongItem } from './SongItem'

export const Queue = () => {
	const { currentSongQueue, currentSongPlaylistSource, setOpenFullScreenPlayer } = useSong()
	function findRightLink() {
		return `/${currentSongPlaylistSource.source}` + (currentSongPlaylistSource.source === 'library' || currentSongPlaylistSource.source === 'search' ? "" : `/${normalizeString(currentSongPlaylistSource.name)}`)
	}
	return (
		<div className="Queue">
			<div className="queueNowIsPlaying">
				<h5 style={{ marginTop: 2 }}>
					Now is playing:
					<Link onClick={() => setOpenFullScreenPlayer(false)} to={findRightLink} className="queueAlbumName">
						<div className="queueImage">
							<img src={currentSongPlaylistSource.image} alt="" />
						</div>
						<span>{shortWord(currentSongPlaylistSource.name, 25)}</span>
					</Link>
				</h5>
			</div>
			{currentSongQueue.map((song, index) => {
				return (
					<SongItem song={song} localIndex={index} key={index} />
				)
			})}
		</div>
	)
}
