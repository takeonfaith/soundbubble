import React, { useRef, useState } from 'react'
import { ColorCircles } from './colorCircles'
import { HiPause, HiPlay } from 'react-icons/hi'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { CgMusicNote } from 'react-icons/cg'
import rightFormanForBigNumber from '../../functions/rightFormatForBigNumber'
import { FiCheck, FiFlag, FiInfo, FiMoreVertical, FiPlusCircle, FiShare, FiTrash2 } from 'react-icons/fi'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { MdKeyboardArrowRight, MdPlaylistAdd } from 'react-icons/md'
import AddOrDeleteButtonFull from './AddOrDeleteSongButton'
import { useAuth } from '../../functionality/AuthContext'
import { firestore } from '../../firebase'
import { useModal } from '../../functionality/ModalClass'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'
import { SongInfo } from '../Basic/SongInfo'
import { IoIosCheckmarkCircle, IoIosRadioButtonOff } from 'react-icons/io'
import { deleteSongFromLibrary } from '../../functions/deleteSongFromLibrary'
import { addSongToLibrary } from '../../functions/addSongToLibrary'
import shortWord from '../../functions/shortWord'
import {AddToPlaylists} from './AddToPlaylists'
export const SongItem = ({ song, localIndex, showListens = false, isNewSong = false, listOfChosenSogns, setListOfSongs }) => {
	const { yourSongs, setCurrentSong, currentSong, displayAuthors, play, songRef, setPlay, setCurrentSongInQueue } = useSong()
	const [openMoreWindow, setOpenMoreWindow] = useState(false)
	const [moreWindowPosRelativeToViewport, setMoreWindowPosRelativeToViewport] = useState(0)
	const currentItemRef = useRef(null)
	const { currentUser } = useAuth()
	const { toggleModal, setContent } = useModal()
	useOutsideClick(currentItemRef, setOpenMoreWindow)
	let listenCountTimeOut

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
	}

	function openSongItemMoreWindow(e) {
		e.stopPropagation()
		setOpenMoreWindow(!openMoreWindow)
		setMoreWindowPosRelativeToViewport(e.target.getBoundingClientRect().top)
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
			return <button onClick={(e) => addSongToLibrary(e, song, currentUser)}>
				<FiPlusCircle />
			</button>
		}
		else {
			return <button onClick={(e) => deleteSongFromLibrary(e, song, currentUser, yourSongs)}>
				<FiCheck />
			</button>
		}
	}

	
	return (
		<>
			{listOfChosenSogns !== undefined ?
				listOfChosenSogns.includes(song.id) ?
					<button type="button" onClick={() => { let filteredList = listOfChosenSogns.filter(el => el !== song.id); setListOfSongs(filteredList) }} className="addToListBtn">
						<IoIosCheckmarkCircle style={{ color: 'var(--lightBlue)' }} />
					</button> :
					<button type="button" onClick={() => setListOfSongs(prev => [...prev, song.id])} className="addToListBtn">
						<IoIosRadioButtonOff />
					</button>
				: null
			}
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
						<img src={song.cover} alt="" />
					</div>
					<div className="songItemNameAndAuthor">
						<div className="songItemName" style={{ display: 'flex', alignItems: 'center' }}>
							{shortWord(song.name, window.innerWidth > 1000?30:17) }
							<span style={{ marginLeft: '10px', fontWeight: '500' }}>
								{showAdditionalInfoIfShould()}
							</span>
						</div>
						<div className="songItemAuthor">{displayAuthors(song.authors)}</div>
					</div>
				</div>
				<div className="songItemMoreBtn" onClick={openSongItemMoreWindow}>
					{addOrDeleteButton()}
					<button>
						<FiMoreVertical />
					</button>
				</div>
				{openMoreWindow ?
					(
						<div className="songItemMenuWindow" style={moreWindowPosRelativeToViewport > (window.innerHeight / 2) + 100 ? { top: 'auto', bottom: '110%' } : { top: '110%', bottom: 'auto' }} onClick={e => e.stopPropagation()}>
							<div className="songItemMenuWindowItem"><AddOrDeleteButtonFull song = {song}/></div>
							<div className="songItemMenuWindowItem">
								<div className="songItemMenuWindow inner">
									<AddToPlaylists song = {song}/>
								</div>
								<MdPlaylistAdd />Add to playlist <MdKeyboardArrowRight />
							</div>
							<div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<FriendsListToShareWith item={song} whatToShare={"song"} />) }}>
								<FiShare />Share
							</div>
							<div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<SongInfo song={song} />) }}><FiInfo />Info</div>
							<div className="songItemMenuWindowItem"><FiFlag />Flag</div>
						</div>
					) :
					null
				}

			</div >
		</>
	)
}
