import React, { useRef, useState } from 'react'
import { ColorCircles } from './colorCircles'
import { HiPause, HiPlay } from 'react-icons/hi'
import { useSong } from '../../functionality/SongPlay/SongContext'
import { CgMusicNote } from 'react-icons/cg'
import rightFormanForBigNumber from '../../functions/rightFormatForBigNumber'
import { FiCheck, FiFlag, FiInfo, FiMoreVertical, FiPlusCircle, FiShare, FiTrash2 } from 'react-icons/fi'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { MdKeyboardArrowRight, MdPlaylistAdd } from 'react-icons/md'
import shareWithOneFriend from '../../functions/shareWithOneFriend'
import { useAuth } from '../../functionality/AuthContext'
import { firestore } from '../../firebase'
import {useModal} from '../../functionality/ModalClass'
import filterArrayWithArray from '../../functions/filterArrayWithArray'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'
import { SongInfo } from '../Basic/SongInfo'
export const SongItem = ({ song, localIndex, showListens = false, isNewSong = false }) => {
	const { yourSongs, setCurrentSong, currentSong, displayAuthors, play, songRef, setPlay, setYourSongs, yourPlaylists, currentSongQueue, setCurrentSongInQueue, fetchYourSongs, songDuration, setYourAuthors, yourFriends } = useSong()
	const [openMoreWindow, setOpenMoreWindow] = useState(false)
	const [moreWindowPosRelativeToViewport, setMoreWindowPosRelativeToViewport] = useState(0)
	const currentItemRef = useRef(null)
	const { currentUser } = useAuth()
	const {toggleModal, setContent} = useModal()
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
		// listenCountTimeOut = setTimeout(() => {
		// 	let listens = song.listens
		// 	listens++
		// 	firestore.collection('songs').doc(song.id).update({
		// 		listens: listens
		// 	})
		// }, songDuration * 1000 * 0.5);
	}

	function openSongItemMoreWindow(e) {
		e.stopPropagation()
		setOpenMoreWindow(!openMoreWindow)
		setMoreWindowPosRelativeToViewport(e.target.getBoundingClientRect().top)
	}

	function addSongToLibrary(e){
		e.stopPropagation()
		const songAuthorsUIDS = song.authors.map(author => author.uid)
		const finalAuthorsUIDS = []
		songAuthorsUIDS.forEach(authorId => {
			if (!currentUser.addedAuthors.includes(authorId)) {
				finalAuthorsUIDS.push(authorId)
			}
		})
		let newList = currentUser.addedSongs
		newList.push(song.id)
		firestore.collection('users').doc(currentUser.uid).update({
			addedSongs: newList,
			addedAuthors: [...finalAuthorsUIDS, ...currentUser.addedAuthors]
		})
		setYourSongs(songs=>[song, ...songs])
		// setYourAuthors()
	}

	function deleteSongFromLibrary(e){
		e.stopPropagation()
		const songAuthorsUIDS = song.authors.map(author => author.uid)
		const finalAuthorsUIDS = []
		let newList = currentUser.addedSongs.filter(songNum => songNum !== song.id)
		songAuthorsUIDS.forEach(authorId => {
			yourSongs.forEach(songObj => {
				if (newList.includes(songObj.id) && songObj.authors.find(a => a.uid === authorId)) {
					finalAuthorsUIDS.push(authorId)
				}
			});
		});

		const filtered = filterArrayWithArray(songAuthorsUIDS, finalAuthorsUIDS)
		const finalFilteredAuthors = filterArrayWithArray(currentUser.addedAuthors, filtered)

		firestore.collection('users').doc(currentUser.uid).update({
			addedSongs: newList,
			addedAuthors:finalFilteredAuthors
		})
		setYourSongs(yourSongs.filter(song => newList.includes(song.id)))
		setOpenMoreWindow(false)
	}



	function addOrDeleteSongToLibrary(e) {
		e.stopPropagation()
		if (currentUser.addedSongs.includes(song.id)) {
			return deleteSongFromLibrary()
		}

		addSongToLibrary()
	}

	function addOrDeleteSongToPlaylist(e) {
		
		// if (yourPlaylists[e.target.id].songs.includes(song.id)) {
		// 	yourPlaylists[e.target.id].songs = yourPlaylists[e.target.id].songs.filter(songNum => songNum !== song.id)
		// 	return
		// }
		// yourPlaylists[e.target.id].songs.push(song.id)
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

	function addOrDeleteButton(){
		if(!currentUser.addedSongs.includes(song.id)){
			return <button onClick={addSongToLibrary}>
				<FiPlusCircle />
			</button>
		}
		else{
			return <button onClick={deleteSongFromLibrary}>
				<FiCheck />
			</button>
		}
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
				{addOrDeleteButton()}
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
									if(currentUser.ownPlaylists.includes(playlist.id) ){
										return (
											<div className="songItemMenuWindowItem" onClick={addOrDeleteSongToPlaylist} key={key} id={key}>
												{!yourPlaylists[key].songs.includes(song.id) ? <FiPlusCircle /> : <FiCheck />}
												{playlist.name}
											</div>
										)
									}
								})}
							</div>
							<MdPlaylistAdd />Add to playlist <MdKeyboardArrowRight/>
						</div>
						<div className="songItemMenuWindowItem" onClick = {()=>{toggleModal(); setContent(<FriendsListToShareWith item = {song} whatToShare = {"song"}/>)}}>
							<FiShare />Share
						</div>
						<div className="songItemMenuWindowItem" onClick = {()=>{toggleModal(); setContent(<SongInfo song = {song}/>)}}><FiInfo />Info</div>
						<div className="songItemMenuWindowItem"><FiFlag />Flag</div>
					</div>
				) :
				null
			}

		</div >
	)
}
