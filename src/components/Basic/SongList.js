import React, { useEffect, useState } from 'react'
import { FaPlay, } from 'react-icons/fa'
import { TiArrowShuffle , TiMediaPlay} from 'react-icons/ti'
import { BsPlayFill} from 'react-icons/bs'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useSong } from '../../contexts/SongContext'
import { displayAuthorsStr } from '../../functions/displayAuthorsStr'
import { SongItem } from '../FullScreenPlayer/SongItem'
import { SearchBar } from './SearchBar'
import { TitleWithMoreBtn } from './TitleWithMoreBtn'
import shuffleSongs from '../../functions/shuffleSongs'

export const SongList = ({ listOfSongs, source, title = "", showListens = false, isNewSong = false, showCount = false, listOfChosenSongs, setListOfSongs, showSearch = false, displayIfEmpty }) => {
	const { setCurrentSongQueue, setCurrentSongPlaylistSource, playSong, setCurrentSong } = useSong()
	const { currentUser } = useAuth()
	const [showMoreSongs, setShowMoreSongs] = useState(false)
	const [searchValue, setSearchValue] = useState("")
	const [displaySongs, setDisplaySongs] = useState(listOfSongs)
	useEffect(() => {
		setDisplaySongs(listOfSongs)
		if(listOfSongs.length > 1) displayAuthorsStr(listOfSongs[1].authors)
	}, [listOfSongs])
	
	function setQueueInSongList() {
		if(source !== 'no' && listOfSongs.length !== 0){
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
	}

	function playShuffledList(e){
		e.stopPropagation()
		let newList = shuffleSongs(listOfSongs)
		console.log(newList)
		setCurrentSongQueue(newList)
		setCurrentSongPlaylistSource(source)
		const listSongsIds = newList.map(song => song.id)
		firestore.collection('users').doc(currentUser.uid).update({
			lastQueue: {
				image: source.image,
				name: source.name,
				songsList: listSongsIds,
				source: source.source
			}
		})
		setCurrentSong(newList[0].id)
		playSong()
	}

	
	return (
		<div className="SongList" onClick={setQueueInSongList}>
			{title.length !== 0 ? <TitleWithMoreBtn title={title} func={() => setShowMoreSongs(!showMoreSongs)} boolVal={showMoreSongs} lenOfList={listOfSongs.length} /> : null}
			{showSearch?<SearchBar value = {searchValue} setValue = {setSearchValue} allFoundSongs = {displaySongs} setAllFoundSongs = {setDisplaySongs} defaultSearchMode = {"songs"} defaultSongsListValue = {listOfSongs} inputText = {"Search for songs"}/>:null}
			{/* {showControls?
				<div className = "listControlButtons">
					<button className = "standartButton"><BsPlayFill /></button>
					<button className = "standartButton" onClick = {playShuffledList}><TiArrowShuffle /></button>
				</div> :null
			} */}
			{displaySongs.map((song, index) => {
				if (title.length !== 0) {
					if (showMoreSongs) {
						return (
							<span className="topSongItem">
								{showCount ? <h3 style = {{opacity:'0.7'}}>{index + 1}</h3> : null}
								<SongItem song={song} key = {song.id} localIndex={index} showListens={showListens} isNewSong={isNewSong} listOfChosenSongs = {listOfChosenSongs} setListOfSongs = {setListOfSongs}/>
							</span>
						)
					}
					else {
						if (index < 5) {
							return <span className="topSongItem">
								{showCount ? <h3 style = {{opacity:'0.7'}}>{index + 1}</h3> : null}
								<SongItem song={song} key = {song.id} localIndex={index} showListens={showListens} isNewSong={isNewSong} listOfChosenSongs = {listOfChosenSongs} setListOfSongs = {setListOfSongs}/>
							</span>
						}
					}
				}
				else {
					return (
						<span className="topSongItem">
							{showCount ? <h3 style = {{opacity:'0.7'}}>{index + 1}</h3> : null}
							<SongItem song={song} key = {song.id} localIndex={index} showListens={showListens} isNewSong={isNewSong} listOfChosenSongs = {listOfChosenSongs} setListOfSongs = {setListOfSongs}/>
						</span>
					)
				}
			})}
			{listOfSongs.length === 0?displayIfEmpty:null}
		</div>
	)
}