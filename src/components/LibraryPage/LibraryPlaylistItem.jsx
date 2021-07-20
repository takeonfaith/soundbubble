import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import shortWord from '../../functions/other/shortWord'
import { HiPause, HiPlay } from 'react-icons/hi'
import { useSong } from '../../contexts/SongContext'
import { usePlaylistSongs } from '../../hooks/usePlaylistSongs'
import { useScreen } from '../../contexts/ScreenContext'
import { BiAlbum } from 'react-icons/bi'
export const LibraryPlaylistItem = ({ playlist }) => {
	const { currentSongPlaylistSource, play } = useSong()
	const { isMobile } = useScreen()
	const [playlistSongs, setPlaylistSongs] = useState([])
	const playSongsInPlaylist = usePlaylistSongs(playlist, playlistSongs, setPlaylistSongs)

	return (
		<Link to={`/albums/${playlist.id}`} className="playlistWrapper">
			<div className="library playlistItem" style={{ backgroundImage: `url(${playlist.image})`, background:'var(--yellowAndPinkGrad)' }}>
				<h2 style={{ background: playlist.imageColors[2] }}>{shortWord(playlist.name, 10)}</h2>
				{!playlist.image?<BiAlbum style = {{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)', width:'60px', height:'60px'}}/>:null}
				{!isMobile ? <button onClick={playSongsInPlaylist}>
					{(currentSongPlaylistSource.name === playlist.name) && play ? <HiPause /> : <HiPlay />}
				</button> : null}
			</div>
		</Link>
	)
}
