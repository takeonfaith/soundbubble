import React, { useRef, useState } from 'react'
import { ColorCircles } from './colorCircles'
import { HiPause, HiPlay } from 'react-icons/hi'
import { useSong } from '../../contexts/SongContext'
import { CgMusicNote } from 'react-icons/cg'
import rightFormanForBigNumber from '../../functions/other/rightFormatForBigNumber'
import { FiX, FiFlag, FiInfo, FiMoreVertical, FiPlusCircle, FiShare, FiTrash2 } from 'react-icons/fi'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { MdKeyboardArrowRight, MdPlaylistAdd } from 'react-icons/md'
import AddOrDeleteButtonFull from './AddOrDeleteSongButton'
import { useAuth } from '../../contexts/AuthContext'
import { firestore } from '../../firebase'
import { useModal } from '../../contexts/ModalContext'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'
import { SongInfo } from '../Basic/SongInfo'
import { deleteSongFromLibrary } from '../../functions/other/deleteSongFromLibrary'
import { addSongToLibrary } from '../../functions/add/addSongToLibrary'
import shortWord from '../../functions/other/shortWord'
import {AddToPlaylists} from './AddToPlaylists'
import { AddToListCircle } from '../Basic/AddToListCircle'
import { useScreen } from '../../contexts/ScreenContext'
import { displayAuthorsStr } from '../../functions/display/displayAuthorsStr'
import { Hint } from '../Basic/Hint'
import { SongItemMoreWindow } from '../Windows/SongItemMoreWindow'
import { SongItemMobileMoreWindow } from '../Windows/SongItemMobileMoreWindow'
import { addSongToHistory } from '../../functions/add/addSongToHistory'
export const SongItem = ({ song, localIndex, showListens = false, isNewSong = false, listOfChosenSongs, setListOfSongs, position }) => {
	const { yourSongs, setCurrentSong, currentSong, displayAuthors, play, songRef, setPlay, setCurrentSongInQueue } = useSong()
	const {isMobile} = useScreen()
	const [openMoreWindow, setOpenMoreWindow] = useState(false)
	const [moreWindowPosRelativeToViewport, setMoreWindowPosRelativeToViewport] = useState(0)
	const currentItemRef = useRef(null)
	const { currentUser, setCurrentUser } = useAuth()
	const { toggleModal, setContent, openConfirm, closeConfirm } = useModal()
	useOutsideClick(currentItemRef, setOpenMoreWindow)

	function chooseSongItem() {
		setCurrentSong(song.id)
		firestore.collection('users').doc(currentUser.uid).update({
			lastSongPlayed: song.id
		})
		
		setCurrentSongInQueue(localIndex)
		if (song.id === currentSong && play) {
			songRef.current.pause();
			setPlay(false)
			// clearTimeout(listenCountTimeOut)
			return
		}
		songRef.current.play();
		setPlay(true)

		addSongToHistory(song.id, currentUser)
	}

	function openSongItemMoreWindow(e) {
		e.stopPropagation()
		setOpenMoreWindow(!openMoreWindow)
		setMoreWindowPosRelativeToViewport(position || e.target.getBoundingClientRect().top)
	}


	function showAdditionalInfoIfShould() {
		return showListens ?
			<span style={{ display: 'flex', alignItems: 'center', opacity: .7, fontSize: '.8em' }} className={isNewSong ? "newSongMarker" : ""}>
				{rightFormanForBigNumber(song.listens)} <CgMusicNote />
			</span> :
			isNewSong ?
				<span style={{ display: 'flex', alignItems: 'center', fontSize: '.7em' }} className={"newSongMarker"}>
					New
				</span> :
				null
	}

	function addOrDeleteButton() {
		if (!currentUser.addedSongs.includes(song.id)) {
			return <button onClick={(e) => addSongToLibrary(e, song, currentUser, setCurrentUser)} style = {{position:"relative"}}>
				<Hint text = {"add song"}/>
				<FiPlusCircle />
			</button>
		}
		else {
			return <button onClick = {(e)=>{e.stopPropagation();openConfirm(`You sure you want to delete "${song.name}" from library?`, "Yes, delete it", "No, just kidding", (e) => {deleteSongFromLibrary(e, song, currentUser, yourSongs);closeConfirm()})}} style = {{position:"relative"}}>
				<Hint text = {"delete song"}/>
				<FiX />
			</button>
		}
	}

	
	return (
		<>
			<AddToListCircle listOfChosenItems = {listOfChosenSongs} setListOfChosenItems = {setListOfSongs} itemId = {song.id}/>
			<div className={'SongItem ' + (song.id === currentSong && play ? "playingNow" : "")} onClick={chooseSongItem} ref={openMoreWindow ? currentItemRef : null} style={openMoreWindow ? { background: 'var(--playlistsColor)' } : {}}>
				<div className="songItemImageAndName">
					<div className="songItemImage">
						<div className="songItemPlayOrPause">
							{song.id === currentSong && play ? null : <HiPlay />}
						</div>
						<div className="playingAnimation" style={song.id === currentSong && play ? { opacity: 1, visibility: 'visible' } : {}}>
							<HiPause />
							<ColorCircles play={play} />
						</div>
						<img loading = "lazy" src={song.cover} alt="" />
					</div>
					<div className="songItemNameAndAuthor">
						<div className="songItemName" style={{ display: 'flex', alignItems: 'center' }}>
							{shortWord(song.name, window.innerWidth > 1000?30:17) }
							<span style={{ marginLeft: '10px', fontWeight: '500' }}>
								{showAdditionalInfoIfShould()}
							</span>
						</div>
						{!isMobile?<div className="songItemAuthor">{displayAuthors(song.authors)}</div>:<div className="songItemAuthor">{displayAuthorsStr(song.authors, ' & ', 30)}</div>}
					</div>
				</div>
				<div className="songItemMoreBtn" >
					{addOrDeleteButton()}
					<button onClick={isMobile?(e)=>{e.stopPropagation();toggleModal();setContent(<SongItemMobileMoreWindow song = {song}/>)}:openSongItemMoreWindow}>
						<Hint text = {"more"}/>
						<FiMoreVertical />
					</button>
				</div>
				<SongItemMoreWindow openMoreWindow = {openMoreWindow} song = {song} moreWindowPosRelativeToViewport = {moreWindowPosRelativeToViewport}/>
			</div >
		</>
	)
}
