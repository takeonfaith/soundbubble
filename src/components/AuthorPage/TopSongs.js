import React, { useState, useEffect } from 'react'
import { songs } from '../../data/songs'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import { useSong } from '../../functionality/SongPlay/SongContext'
import findIfSongIsNew from '../../functions/findIfSongIsNew'
import { MoreBtn } from '../Basic/MoreBtn'
import { SongItem } from '../FullScreenPlayer/SongItem'
export const TopSongs = ({ authorId, authorsData, headerColors }) => {
	const [popularSongs, setPopularSongs] = useState([])
	const { setCurrentSongQueue, setCurrentSongPlaylistSource } = useSong()
	const [openAllSongs, setOpenAllSongs] = useState(false)
	const [newSongs, setNewSongs] = useState([])
	const { currentUser } = useAuth()
	useEffect(() => {


	}, [authorId])

	async function findAuthorsSongs() {
		setPopularSongs([])
		const tempArray = []
		if(authorsData.isAuthor){
			if (authorsData.ownSongs !== undefined && authorsData.ownSongs.length !== 0) {
				const response = firestore.collection("songs")
					.where("id", "in", authorsData.ownSongs)
				const data = await response.get();
				data.docs.forEach(item => {
					tempArray.push(item.data())
					if (findIfSongIsNew(item.data()) && !newSongs.includes(item.data())) setNewSongs(prevSongs => [...prevSongs, item.data()])
				})
			}
			tempArray.sort((a, b) => b.listens - a.listens)
			setPopularSongs(tempArray)
		}
		else{
			if (authorsData.addedSongs !== undefined && authorsData.addedSongs.length !== 0 && authorsData.addedSongs.length < 10) {
				console.log(authorsData.addedSongs)
				const response = firestore.collection("songs")
					.where("id", "in", authorsData.addedSongs)
				const data = await response.get();
				data.docs.forEach(item => {
					tempArray.push(item.data())
				})
			}
			tempArray.sort((a, b) => b.listens - a.listens)
			setPopularSongs(tempArray)
		}
	}

	useEffect(() => {
		findAuthorsSongs()
		setNewSongs([])
	}, [authorsData.ownSongs])

	function setQueueInAuthor(songList) {
		const source = { source: `/authors/${authorsData.uid}`, name: authorsData.displayName, image: authorsData.photoURL, songsList: popularSongs }
		setCurrentSongQueue(songList)
		setCurrentSongPlaylistSource(source)
		firestore.collection('users').doc(currentUser.uid).update({
			lastQueue: {
				image: source.image,
				name: source.name,
				songsList: source.songsList,
				source: source.source
			}
		})
	}
	return authorsData.isAuthor ?
		(<div className="TopSongs">
			<div onClick={() => setQueueInAuthor(newSongs)}>
				{newSongs.map((song, index) => {
					return <SongItem song={song} localIndex={index} key={index} isNewSong={true} />
				})}
			</div>
			<div className="topTitle">
				<h2 style={newSongs.length ? { marginTop: '0' } : {}}>Popular songs</h2>
				<MoreBtn func={() => setOpenAllSongs(!openAllSongs)} boolVal={openAllSongs} lenOfList={popularSongs.length} />
			</div>
			<div className="topSongsWrapper">
				{popularSongs.map((song, index) => {
					if (!openAllSongs) {
						if (index < 5) {
							return (
								<div className="topSongItem" key={index} onClick={() => setQueueInAuthor(popularSongs)}>
									<h3 style={{ color: headerColors[3] }}>{index + 1}</h3>
									<SongItem song={song} localIndex={index} showListens={true} listens={song.listens} />
								</div>
							)
						}
					}
					else {
						return (
							<div className="topSongItem" key={index} onClick={setQueueInAuthor}>
								<h3 style={{ color: headerColors[3] }}>{index + 1}</h3>
								<SongItem song={song} localIndex={index} showListens={true} listens={song.listens} />
							</div>
						)
					}
				})}
			</div>
		</div>) :
		(
			<div className="TopSongs">
				<div className="topTitle">
					<h2 style={newSongs.length ? { marginTop: '0' } : {}}>{authorsData.displayName}'s library</h2>
					<MoreBtn func={() => setOpenAllSongs(!openAllSongs)} boolVal={openAllSongs} lenOfList={popularSongs.length} />
				</div>
				<div className="topSongsWrapper">
					{popularSongs.map((song, index) => {
						if (!openAllSongs) {
							if (index < 5) {
								return (
									<div className="topSongItem" key={index} onClick={() => setQueueInAuthor(popularSongs)}>
										<h3 style={{ color: headerColors[3] }}>{index + 1}</h3>
										<SongItem song={song} localIndex={index} showListens={true} listens={song.listens} />
									</div>
								)
							}
						}
						else {
							return (
								<div className="topSongItem" key={index} onClick={setQueueInAuthor}>
									<h3 style={{ color: headerColors[3] }}>{index + 1}</h3>
									<SongItem song={song} localIndex={index} showListens={true} listens={song.listens} />
								</div>
							)
						}
					})}
				</div>
			</div>
		)
}
