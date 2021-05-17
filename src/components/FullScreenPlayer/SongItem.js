import React, { useRef, useState } from 'react'
import { ColorCircles } from './colorCircles'
import { HiPause, HiPlay } from 'react-icons/hi'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { CgMusicNote } from 'react-icons/cg'
import rightFormanForBigNumber from '../../functions/rightFormatForBigNumber'
import { FiCheck, FiFlag, FiInfo, FiMoreVertical, FiPlusCircle, FiShare, FiTrash2 } from 'react-icons/fi'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { songs } from '../../data/songs'
import { MdPlaylistAdd } from 'react-icons/md'
import { friends } from '../../data/friends'
import { authors } from '../../data/authors'
import shareWithOneFriend from '../../functions/shareWithOneFriend'
import { useAuth } from '../../functionality/AuthContext'
import { firestore } from '../../firebase'
export const SongItem = ({ song, localIndex, showListens = false, listens = 0, isNewSong = false }) => {
	const { setCurrentSong, currentSong, displayAuthors, play, songRef, setPlay, setYourSongs, yourPlaylists, currentSongQueue, setCurrentSongInQueue, fetchYourSongs } = useSong()
	const [openMoreWindow, setOpenMoreWindow] = useState(false)
	const [moreWindowPosRelativeToViewport, setMoreWindowPosRelativeToViewport] = useState(0)
	const currentItemRef = useRef(null)
	const {currentUser} = useAuth()
	useOutsideClick(currentItemRef, setOpenMoreWindow)

	function chooseSongItem() {
		setCurrentSong(song.id)
		firestore.collection('users').doc(currentUser.uid).update({
			lastSongPlayed:song.id
		})
		setCurrentSongInQueue(localIndex)
		if (song.id === currentSong && play) {
			songRef.current.pause();
			setPlay(false)
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
			{openMoreWindow ?
				(
					<div className="songItemMenuWindow" style={moreWindowPosRelativeToViewport > (window.innerHeight / 2) + 100 ? { top: 'auto', bottom: '110%' } : { top: '110%', bottom: 'auto' }} onClick={e => e.stopPropagation()}>
						<div className="songItemMenuWindowItem" onClick={addOrDeleteSongToLibrary}>{currentUser.addedSongs.includes(song.id) ? <span><FiTrash2 />Delete</span> : <span><FiPlusCircle />Add</span>}</div>
						<div className="songItemMenuWindowItem">
							<div className="songItemMenuWindow inner">
								{yourPlaylists.map((playlist, key) => {
									if (!playlist.isAlbum && playlist.authors.includes(30))
										return (
											<div className="songItemMenuWindowItem" onClick={addOrDeleteSongToPlaylist} key={key} id={key}>
												{!yourPlaylists[key].songs.includes(song.id) ? <FiPlusCircle /> : <FiCheck />}
												{playlist.name}
											</div>
										)
								})}
							</div>
							<MdPlaylistAdd />Add to playlist
						</div>
						<div className="songItemMenuWindowItem">
							<div className="songItemMenuWindow inner">
								{friends['30'].map((friendId, key) => {
									const friend = authors[friendId]
									if (key < 3)
										return (
											<div className="songItemMenuWindowItem" onClick={(e)=>shareWithOneFriend(e, song.id)} key={key} id={friendId}>
												<div className="songItemMenuWindowItemImgWrapper">
													<img src={friend.image} alt="" />
												</div>
												{friend.name}
											</div>
										)
								})}
							</div>
							<FiShare />Share
						</div>
						<div className="songItemMenuWindowItem"><FiInfo />Info</div>
						<div className="songItemMenuWindowItem"><FiFlag />Flag</div>
					</div>
				) :
				null
			}

		</div >
	)
}
