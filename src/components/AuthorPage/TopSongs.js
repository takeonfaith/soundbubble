import React, { useState, useEffect } from 'react'
import { songs } from '../../data/songs'
import { useSong } from '../../functionality/SongPlay/SongContext'
import findIfSongIsNew from '../../functions/findIfSongIsNew'
import { MoreBtn } from '../Basic/MoreBtn'
import { SongItem } from '../FullScreenPlayer/SongItem'
export const TopSongs = ({author, authorsData, headerColors }) => {
	const [popularSongs, setPopularSongs] = useState([])
	const { setCurrentSongQueue, setCurrentSongPlaylistSource } = useSong()
	const [openAllSongs, setOpenAllSongs] = useState(false)
	const [newSongs, setNewSongs] = useState([])

	useEffect(() => {
		setNewSongs([])
	}, [author])

	useEffect(() => {
		let tempArray = []
		songs['allSongs'].forEach((song, i) => {
			if (song.authors.includes(authorsData.name)) {
				tempArray.push(song)
				if(findIfSongIsNew(song) && !newSongs.includes(song)) setNewSongs(prevSongs=>[...prevSongs,song])
			}
		})
		tempArray.sort((a, b) => b.listens - a.listens)
		setPopularSongs(tempArray)
	}, [authorsData])

	function setQueueInAuthor(songList) {
		setCurrentSongQueue(songList)
		setCurrentSongPlaylistSource({ source: 'authors', name: authorsData.name, image: authorsData.image, songsList:popularSongs })
	}
	return (
		<div className="TopSongs">
			<div onClick = {()=>setQueueInAuthor(newSongs)}>
				{newSongs.map((song, index)=>{
					return <SongItem song = {song} localIndex = {index} key = {index} isNewSong = {true}/>
				})}
			</div>
			<div className="topTitle">
				<h2 style = {newSongs.length?{marginTop:'0'}:{}}>Popular songs</h2>
				<MoreBtn func={() => setOpenAllSongs(!openAllSongs)} boolVal={openAllSongs} lenOfList={popularSongs.length} />
			</div>
			<div className="topSongsWrapper">
				{popularSongs.map((song, index) => {
					if (!openAllSongs) {
						if (index < 5) {
							return (
								<div className="topSongItem" key={index} onClick={()=>setQueueInAuthor(popularSongs)}>
									<h3 style={{ color: headerColors[3] }}>{index + 1}</h3>
									<SongItem song = {song} localIndex = {index} showListens={true} listens={song.listens} />
								</div>
							)
						}
					}
					else {
						return (
							<div className="topSongItem" key={index} onClick={setQueueInAuthor}>
								<h3 style={{ color: headerColors[3] }}>{index + 1}</h3>
								<SongItem song = {song} localIndex = {index} showListens={true} listens={song.listens} />
							</div>
						)
					}
				})}
			</div>
		</div>
	)
}
