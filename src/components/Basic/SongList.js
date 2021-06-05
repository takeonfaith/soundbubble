import React, { useState } from 'react'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { SongItem } from '../FullScreenPlayer/SongItem'
import { TitleWithMoreBtn } from './TitleWithMoreBtn'

export const SongList = ({ listOfSongs, source, title = "", showListens = false, isNewSong = false, showCount = false }) => {
	const { setCurrentSongQueue, setCurrentSongPlaylistSource } = useSong()
	const { currentUser } = useAuth()
	const [showMoreSongs, setShowMoreSongs] = useState(false)
	function setQueueInSongList() {
		setCurrentSongQueue(listOfSongs)
		setCurrentSongPlaylistSource(source)
		const listSongsIds = listOfSongs.map(song => song.id)
		firestore.collection('users').doc(currentUser.uid).update({
			lastQueue: {
				image: source.image,
				name: source.name,
				songsList: listSongsIds,
				source: source.source
			}
		})
	}
	return (
		<div className="SongList" onClick={setQueueInSongList}>
			{title.length !== 0 ? <TitleWithMoreBtn title={title} func={() => setShowMoreSongs(!showMoreSongs)} boolVal={showMoreSongs} lenOfList={listOfSongs.length} /> : null}
			{listOfSongs.map((song, index) => {
				if (title.length !== 0) {
					if (showMoreSongs) {
						return (
							<span className="topSongItem">
								{showCount ? <h3 style = {{opacity:'0.7'}}>{index + 1}</h3> : null}
								<SongItem song={song} localIndex={index} showListens={showListens} isNewSong={isNewSong} />
							</span>
						)
					}
					else {
						if (index < 5) {
							return <span className="topSongItem">
								{showCount ? <h3 style = {{opacity:'0.7'}}>{index + 1}</h3> : null}
								<SongItem song={song} localIndex={index} showListens={showListens} isNewSong={isNewSong} />
							</span>
						}
					}
				}
				else {
					return (
						<span className="topSongItem">
							{showCount ? <h3 style = {{opacity:'0.7'}}>{index + 1}</h3> : null}
							<SongItem song={song} localIndex={index} showListens={showListens} isNewSong={isNewSong} />
						</span>
					)
				}
			})}
		</div>
	)
}
