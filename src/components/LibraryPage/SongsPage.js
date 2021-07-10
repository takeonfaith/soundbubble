import React, { useEffect } from 'react'
import { useSong } from '../../contexts/SongContext'
import wave from '../../images/wave2.svg'
import { useAuth } from '../../contexts/AuthContext'
import { LibraryPlaylistItem } from '../../components/LibraryPage/LibraryPlaylistItem'
import { SongList } from '../Basic/SongList'
import { Link } from 'react-router-dom'
import { firestore } from '../../firebase'
export const SongsPage = () => {
	const { yourSongs, yourPlaylists, setYourSongs } = useSong()
	const { currentUser } = useAuth()
	return (
		<div className="SongsPage">
			<div className="playLists">
				<div className="playlistContent">
					{yourPlaylists.map((p, index) => {
						return (
							<LibraryPlaylistItem playlist={p} key={index} />
						)
					})}
				</div>
				<div className="playlistsBackground">
					<img src={wave} alt="erwerrnjeqjweqwqeqwewerbjfrwjfbewjerbh" />
				</div>
			</div>
			<div className="yourSongsList">
				<SongList listOfSongs={yourSongs} source={{ source: '/library', name: "Your Library", image: currentUser.photoURL, songsList: yourSongs }} showSearch displayIfEmpty={<Link to="/search"><button className="standartButton">Search for songs</button></Link>} />
			</div>
		</div>
	)
}
