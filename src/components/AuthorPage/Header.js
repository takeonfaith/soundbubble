import React, { useEffect, useRef, useState } from 'react'
import { FiFlag, FiHeadphones, FiInfo, FiMoreVertical, FiPlusCircle, FiSettings, FiShare, FiTrash, FiUserCheck, FiUserPlus } from 'react-icons/fi'
import { ImCheckmark } from 'react-icons/im'
import { useSong } from '../../functionality/SongPlay/SongContext'
import displayDate from '../../functions/displayDate'
import { BackBtn } from '../Basic/BackBtn'
import { SmallImages } from './SmallImages'
import { useAuth } from '../../functionality/AuthContext'
import { IoMdExit } from 'react-icons/io'
import { firestore } from '../../firebase'
import rightFormanForBigNumber from '../../functions/rightFormatForBigNumber'
import { CgCheckO, CgLock } from 'react-icons/cg'
import { useModal } from '../../functionality/ModalClass'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { ChatWithFriendButton } from './ChatWithFriendButton'
import { LoadingCircle } from '../Basic/LoadingCircle'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BiLoaderAlt } from 'react-icons/bi'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'
export const Header = ({ data, headerColors }) => {
	const { displayAuthors, setYourPlaylists } = useSong()
	const [albumAuthors, setAlbumAuthors] = useState([])
	const [authorsImages, setAuthorsImages] = useState([])
	const { currentUser, logout } = useAuth()
	const [openMoreWindow, setOpenMoreWindow] = useState(false)
	const {toggleModal, setContent} = useModal()
	const moreWindowRef = useRef(null)
	useOutsideClick(moreWindowRef, setOpenMoreWindow)
	async function fetchAuthorsData() {
		if (data.authors !== undefined && !albumAuthors.length) {
			const ids = data.authors.map(author => author.uid)
			const response = firestore.collection("users").where("uid", "in", ids)
			const authrorsData = await response.get();
			console.log(authrorsData.docs)
			authrorsData.docs.forEach((a) => {
				console.log(a.data())
				setAlbumAuthors(prev => [...prev, a.data()])
				setAuthorsImages(prev => [...prev, a.data().photoURL])
			})
		}
	}
	useEffect(() => {
		fetchAuthorsData()
	}, [data])

	function displayCreationDateIfExists() {
		return data.creationDate !== undefined ?
			<div className="headerListenersAndSubsItem">
				<span>{displayDate(data.creationDate)}</span>
			</div> :
			null
	}

	function isAlbumOrIsAuthor() {
		return data.authors !== undefined ? data.isAlbum ? <h5>Album</h5> : <h5>Playlist</h5> : data.isAuthor ? <h5>Author</h5> : <h5>User</h5>
	}

	function showCreatorsIfExist() {
		return data.authors !== undefined ?
			<div className="headerAuthorsImagesAndNames">
				<SmallImages imagesList={authorsImages} borderColor={headerColors[2]} />
				<div className="headerAuthors">{displayAuthors(albumAuthors, ", ")}</div>
			</div> :
			null
	}

	function findIfIsVerified() {
		return data.isVerified ? <ImCheckmark style={{ color: headerColors[0] }} /> : null
	}

	async function addPlaylistToLibrary() {
		const addedPlaylists = (await firestore.collection('users').doc(currentUser.uid).get()).data().addedPlaylists
		addedPlaylists.push(data.id)
		setYourPlaylists(prev => [data.id, ...prev])
		firestore.collection('users').doc(currentUser.uid).update({
			addedPlaylists: addedPlaylists
		})
	}

	async function addAuthorToLibrary() {
		const addedAuthors = (await firestore.collection('users').doc(currentUser.uid).get()).data().addedAuthors
		addedAuthors.push(data.uid)
		firestore.collection('users').doc(currentUser.uid).update({
			addedAuthors: addedAuthors
		})
		console.log(data.subscribers)
		let subscribers = data.subscribers
		subscribers++
		firestore.collection('users').doc(data.uid).update({
			subscribers: subscribers
		})
	}

	function addFriend(){
		const updatedDataForFriend = data.friends
		const updatedDataForCurrentUser = currentUser.friends
		updatedDataForFriend.push({status:'requested', uid:currentUser.uid})
		updatedDataForCurrentUser.push({status:'awaiting', uid:data.uid})

		firestore.collection('users').doc(data.uid).update({
			friends:updatedDataForFriend
		})

		firestore.collection('users').doc(currentUser.uid).update({
			friends:updatedDataForCurrentUser
		})

	}

	function deleteFriend(){

	}

	function whatButtonToRender() {
		if (data.authors) {
			if (currentUser.ownPlaylists.includes(data.id)) return <button><FiTrash /></button>
			else if (currentUser.addedPlaylists.includes(data.id)) return <button><CgCheckO /></button>
			else return <button onClick={addPlaylistToLibrary}><FiPlusCircle /></button>
		}
		else {
			if (currentUser.addedAuthors.includes(data.uid)) return <button><CgCheckO /></button>
			else if (currentUser.uid === data.uid) return <button onClick = {()=>{toggleModal();}}><FiSettings /></button>
			else if(!data.isAuthor && currentUser.friends.find(friend=>friend.uid === data.uid && friend.status === 'added')) return <button onClick={deleteFriend}><FiUserCheck /></button>
			else if(!data.isAuthor && currentUser.friends.find(friend=>((friend.uid === data.uid) && (friend.status === 'awaiting')))) return <button onClick={addFriend}><BiLoaderAlt style = {{animation:'loading 1s infinite linear'}}/></button>
			else if(!data.isAuthor) return <button onClick={addFriend}><FiUserPlus /></button>
			else return <button onClick={addAuthorToLibrary}><FiPlusCircle /></button>
		}
	}

	function findIfIsPrivate() {
		return data.isPrivate ? <CgLock /> : null
	}

	return (
		<div className="Header" style={headerColors.length ? { background: `linear-gradient(45deg, ${headerColors[2]}, ${headerColors[0]})` } : { background: 'var(--yellowAndPinkGrad)' }}>
			<div className="headerBtns" style={{ background: headerColors[2] }}>
				<BackBtn />
				<div className="headerBackBtn">
					{whatButtonToRender()}
				</div>
				<div className="headerMoreBtn" ref = {moreWindowRef}>
					<button onClick = {()=>setOpenMoreWindow(!openMoreWindow)}>
						<FiMoreVertical />
					</button>
					{openMoreWindow ?
						(
							<div className="songItemMenuWindow" style={{ top: '110%', bottom: 'auto' }} onClick={e => e.stopPropagation()} >
								{/* <div className="songItemMenuWindowItem" onClick={addOrDeleteSongToLibrary}>{currentUser.addedSongs.includes(song.id) ? <span><FiTrash2 />Delete</span> : <span><FiPlusCircle />Add</span>}</div> */}
								{/* <div className="songItemMenuWindowItem">
									<div className="songItemMenuWindow inner">
										{yourPlaylists.map((playlist, key) => {
											if (currentUser.ownPlaylists.includes(playlist.id)) {
												return (
													<div className="songItemMenuWindowItem" onClick={addOrDeleteSongToPlaylist} key={key} id={key}>
														{!yourPlaylists[key].songs.includes(song.id) ? <FiPlusCircle /> : <FiCheck />}
														{playlist.name}
													</div>
												)
											}
										})}
									</div>
									<MdPlaylistAdd />Add to playlist <MdKeyboardArrowRight />
								</div> */}
								<div className="songItemMenuWindowItem" onClick = {()=>{toggleModal(); setContent(<FriendsListToShareWith item = {data} whatToShare = {data.authors !== undefined ?'playlist':'author'}/>)}}>
									<FiShare />Share
								</div>
								<div className="songItemMenuWindowItem"><FiInfo />Info</div>
								<div className="songItemMenuWindowItem"><FiFlag />Flag</div>
							</div>
						) :
						null
					}
				</div>
				{
					currentUser.uid === data.uid ?
						<button onClick={logout} >
							<IoMdExit />
						</button> :
						null
				}
			</div>
			<div className="headerAuthorsImage" style={data.authors === undefined ? { animation: "floatingBorderRadius 10s infinite ease-in-out" } : {}}>
				<img src={data.photoURL || data.image} alt="" />
			</div>
			<div className="headerAuthorInfo">
				<div className="headerAuthorsName">
					{isAlbumOrIsAuthor()}
					<div style={{ display: 'flex', alignItems: 'center', margin: "2px 0 10px 0" }}>
						<h1>{data.displayName || data.name}</h1>
						{findIfIsVerified()}
						{findIfIsPrivate()}
					</div>
				</div>
				{showCreatorsIfExist()}
				<div className="headerListenersAndSubs">
					<div className="headerListenersAndSubsItem" title={(data.listens ?? data.numberOfListenersPerMonth) + ' listeners per month'}>
						<span>{rightFormanForBigNumber(data.listens ?? data.numberOfListenersPerMonth)}</span>
						<FiHeadphones />
					</div>
					<div className="headerListenersAndSubsItem" title={data.subscribers + ' subscribers'}>
						<span>{rightFormanForBigNumber(data.subscribers)}</span>
						<FiUserPlus />
					</div>
					{displayCreationDateIfExists()}
				</div>
				{currentUser.friends.find(friend=>(friend.uid === data.uid && friend.status === 'added'))?<ChatWithFriendButton data = {data} color = {headerColors[3]}/>:null}
			</div>
		</div>
	)
}
