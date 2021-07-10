import React, { useRef, useState } from 'react'
import { ColorCircles } from '../FullScreenPlayer/colorCircles'
import { HiPause, HiPlay } from 'react-icons/hi'
import { useSong } from '../../contexts/SongContext'
import { CgMusicNote } from 'react-icons/cg'
import rightFormanForBigNumber from '../../functions/rightFormatForBigNumber'
import { FiCheck, FiMoreVertical, FiPlusCircle, FiShare, FiTrash2 } from 'react-icons/fi'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useAuth } from '../../contexts/AuthContext'
import { firestore } from '../../firebase'
export const SongItemChoice = ({ song, listOfSongs, setListOfSongs, showListens = false, listens = 0, isNewSong = false }) => {
	const { setCurrentSong, currentSong, displayAuthors, play, songRef, setPlay, setYourSongs, yourPlaylists, currentSongQueue, setCurrentSongInQueue, fetchYourSongs } = useSong()
	const [openMoreWindow, setOpenMoreWindow] = useState(false)
	const [moreWindowPosRelativeToViewport, setMoreWindowPosRelativeToViewport] = useState(0)
	const currentItemRef = useRef(null)
	const {currentUser} = useAuth()
	useOutsideClick(currentItemRef, setOpenMoreWindow)

	function openSongItemMoreWindow(e) {
		e.stopPropagation()
		setOpenMoreWindow(!openMoreWindow)
		setMoreWindowPosRelativeToViewport(e.target.getBoundingClientRect().top)
	}

	function addSongToList() {
		if(!listOfSongs.includes(song.id)){
			return setListOfSongs(prev=>[...prev, song.id])
		}

		let filteredList = listOfSongs.filter(el=>el !== song.id)
		setListOfSongs(filteredList)
	}

	function addOrDeleteSongToLibrary(e) {
		e.stopPropagation()
		if (currentUser.addedSongs.includes(song.id)) {
			let newList = currentUser.addedSongs.filter(songNum => songNum !== song.id)
			firestore.collection('users').doc(currentUser.uid).update({
				addedSongs:newList
			})
			fetchYourSongs()
			setOpenMoreWindow(false)
			return
		}

		let newList = currentUser.addedSongs
		newList.push(song.id)
		firestore.collection('users').doc(currentUser.uid).update({
			addedSongs:newList
		})
		fetchYourSongs()
	}

	function addOrDeleteSongToPlaylist(e) {
		e.stopPropagation()
		if (yourPlaylists[e.target.id].songs.includes(song.id)) {
			yourPlaylists[e.target.id].songs = yourPlaylists[e.target.id].songs.filter(songNum => songNum !== song.id)
			return
		}
		yourPlaylists[e.target.id].songs.push(song.id)
	}

	function showAdditionalInfoIfShould() {
		return showListens ?
			<span style={{ display: 'flex', alignItems: 'center', opacity: .7, fontSize: '.8em' }} className={isNewSong ? "newSongMarker" : ""}>
				{rightFormanForBigNumber(listens)} <CgMusicNote />
			</span> :
			isNewSong ?
			<span style={{ display: 'flex', alignItems: 'center', fontSize: '.7em' }} className={"newSongMarker"}>
				New
			</span> :
				null
	}

	return (
		<div className={'SongItem ' + (listOfSongs.includes(song.id) ? "inList" : "")} onClick={addSongToList} ref={openMoreWindow ? currentItemRef : null} style={openMoreWindow ? { background: 'var(--playlistsColor)' } : {}}>
			<div className="songItemImageAndName">
				<div className="songItemImage">
					<div className="songItemPlayOrPause">
						{song.id === currentSong && play ? null : <HiPlay />}
					</div>
					<div className="playingAnimation" style={song.id === currentSong && play ? { opacity: 1, visibility: 'visible' } : {}}>
						<HiPause />
						<ColorCircles play={play} />
					</div>
					<img src={song.cover} alt="" />
				</div>
				<div className="songItemNameAndAuthor">
					<div className="songItemName" style={{ display: 'flex', alignItems: 'center' }}>
						{song.name}
						<span style={{ marginLeft: '10px', fontWeight: '500' }}>
							{showAdditionalInfoIfShould()}
						</span>
					</div>
					<div className="songItemAuthor">{displayAuthors(song.authors)}</div>
				</div>
			</div>
			<div className="songItemMoreBtn" onClick={openSongItemMoreWindow}>
				<button onClick={addOrDeleteSongToLibrary}>
					{!currentUser.addedSongs.includes(song.id) ? <FiPlusCircle /> : <FiCheck />}
				</button>
				<button>
					<FiMoreVertical />
				</button>
			</div>
		</div >
	)
}
