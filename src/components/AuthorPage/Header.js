import React, { useEffect, useRef, useState } from 'react'
import { FiEdit2, FiFlag, FiHeadphones, FiInfo, FiMoreVertical, FiPlusCircle, FiSettings, FiShare, FiTrash, FiUserCheck, FiUserPlus } from 'react-icons/fi'
import { ImCheckmark } from 'react-icons/im'
import { useSong } from '../../contexts/SongContext'
import displayDate from '../../functions/displayDate'
import { BackBtn } from '../Basic/BackBtn'
import { SmallImages } from './SmallImages'
import { useAuth } from '../../contexts/AuthContext'
import { IoMdExit } from 'react-icons/io'
import { firestore } from '../../firebase'
import rightFormanForBigNumber from '../../functions/rightFormatForBigNumber'
import { CgCheckO, CgLock } from 'react-icons/cg'
import { useModal } from '../../contexts/ModalContext'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { ChatWithFriendButton } from './ChatWithFriendButton'
import { LoadingCircle } from '../Basic/LoadingCircle'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BiLoaderAlt } from 'react-icons/bi'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'
import { CustomizeAlbum } from '../AlbumPage/CustomizeAlbum'
import { addAuthorToLibrary } from '../../functions/addAuthorToLibrary'
import addFriend from '../../functions/addFriend'
import { LastSongListened } from './LastSongListened'
import { LastSeen } from '../Basic/LastSeen'
import { addPlaylistToLibrary } from '../../functions/addPlaylistToLibrary'
import { removePlaylistFromLibrary } from '../../functions/removePlaylistFromLibrary'
import { SettingsList } from '../Settings/SettingsList'
import { Hint } from '../Basic/Hint'
import { useScreen } from '../../contexts/ScreenContext'
import { AuthorMoreWindow } from '../Windows/AuthorMoreWindow'
import { CirclePages } from '../Tools/CirclePages'
import { useSwipeable } from 'react-swipeable'
export const Header = ({ data, headerColors }) => {
	const { isMobile } = useScreen()
	const { displayAuthors, setYourPlaylists } = useSong()
	const [albumAuthors, setAlbumAuthors] = useState([])
	const [authorsImages, setAuthorsImages] = useState([])
	const { currentUser, logout } = useAuth()
	const [mobileCurrentPage, setMobileCurrentPage] = useState(0)
	const [deltaX, setDeltaX] = useState(0)
	const [transformTransition, setTransformTransition] = useState(0.05)
	const [openMoreWindow, setOpenMoreWindow] = useState(false)
	const headerRef = useRef(null)
	const handlers = useSwipeable({
		onSwiping: (event) => { setDeltaX(event.deltaX); }
	})
	const { toggleModal, setContent, openConfirm, closeConfirm } = useModal()
	const isFriend = currentUser.friends.find(friend => (friend.uid === data.uid && friend.status === 'added'))
	const moreWindowRef = useRef(null)
	useOutsideClick(moreWindowRef, setOpenMoreWindow)


	function returnToInitial() {
		let dropDelta
		clearTimeout(dropDelta)
		setTransformTransition(0.2)
		setDeltaX(0)
		dropDelta = setTimeout(() => {
			setTransformTransition(0)
			
		}, 200)
	}

	useEffect(() => {
		if (mobileCurrentPage === 0 && deltaX < -150) {
			setMobileCurrentPage(1)
			setDeltaX(0)
		}
		else if (mobileCurrentPage === 1 && deltaX > 150) {
			setMobileCurrentPage(0)
			setDeltaX(0)
		}
	}, [deltaX])

	console.log(deltaX)

	async function fetchAuthorsData() {
		if (data.authors !== undefined && !albumAuthors.length) {
			const ids = data.authors.map(author => author.uid)
			const response = firestore.collection("users").where("uid", "in", ids)
			const authrorsData = await response.get();
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

	const refPassthroughHeader = (el) => {
		handlers.ref(el);
		headerRef.current = el;
	}

	function displayCreationDateIfExists() {
		return data.creationDate !== undefined ?
			<div className="headerListenersAndSubsItem">
				<span>{displayDate(data.creationDate)}</span>
			</div> :
			null
	}

	function isAlbumOrIsAuthor() {
		return data.authors !== undefined ? data.isAlbum ? <h5>Album</h5> : <h5>Playlist</h5> : data.isAuthor ? <h5>Author</h5> : <h5>User {data.authors === undefined && isFriend ? <LastSeen userUID={data.uid} /> : null}</h5>
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

	function deleteFriend() {

	}

	function deletePlaylist() {

	}

	function whatButtonToRender() {
		if (data.authors) {
			if (currentUser.ownPlaylists.includes(data.id)) return <button onClick={() => openConfirm("Are you sure you want to DELETE this playlist forever?!", "Yes, pretty sure", "No, I Don't!", () => { deletePlaylist(data, currentUser); closeConfirm() })}><Hint text={"delete playlist"} direction={"bottom"} /><FiTrash /></button>
			else if (currentUser.addedPlaylists.includes(data.id)) return <button onClick={() => openConfirm("Are you sure you want to remove this playlist from library?", "Yes, pretty sure", "No-no-no, go away", () => { removePlaylistFromLibrary(data, currentUser); closeConfirm() })}><Hint text={"remove playlist from library"} direction={"bottom"} /><CgCheckO /></button>
			else return <button onClick={() => addPlaylistToLibrary(data, currentUser)}><Hint text={"add playlist"} direction={"bottom"} /><FiPlusCircle /></button>
		}
		else {
			if (currentUser.addedAuthors.includes(data.uid)) return <button><Hint text={"remove author from library"} direction={"bottom"} /><CgCheckO /></button>
			else if (currentUser.uid === data.uid) return <button onClick={() => { toggleModal(); setContent(<SettingsList />) }}><Hint text={"settings"} direction={"bottom"} /><FiSettings /></button>
			else if (!data.isAuthor && currentUser.friends.find(friend => friend.uid === data.uid && friend.status === 'added')) return <button onClick={deleteFriend}><Hint text={"remove from friend list"} direction={"bottom"} /><FiUserCheck /></button>
			else if (!data.isAuthor && currentUser.friends.find(friend => ((friend.uid === data.uid) && (friend.status === 'awaiting')))) return <button onClick={addFriend}><Hint text={"waiting for response"} direction={"bottom"} /><BiLoaderAlt style={{ animation: 'loading 1s infinite linear' }} /></button>
			else if (!data.isAuthor) return <button onClick={() => addFriend(data, currentUser)}><Hint text={"add friend"} direction={"bottom"} /><FiUserPlus /></button>
			else return <button onClick={() => addAuthorToLibrary(data, currentUser)}><Hint text={"subscribe"} direction={"bottom"} /><FiPlusCircle /></button>
		}
	}

	function findIfIsPrivate() {
		return data.isPrivate ? <CgLock /> : null
	}

	function editButton() {
		return (data.authors && data.authors.find(person => person.uid === currentUser.uid)) || (data.authors && currentUser.isAdmin) ? <button onClick={() => { toggleModal(); setContent(<CustomizeAlbum playlist={data} />) }} className="customizeAlbumBtn"><FiEdit2 /></button> : null
	}

	return (
		<div className="Header" style={headerColors.length ? { background: `linear-gradient(45deg, ${headerColors[2]}, ${headerColors[0]})` } : { background: 'var(--yellowAndPinkGrad)' }} ref={refPassthroughHeader} onTouchEnd={returnToInitial}>
			<div className="headerBtns" style={{ background: headerColors[2] }}>
				<BackBtn />
				<div style={{ display: 'flex' }}>
					<div className="headerBackBtn">
						{whatButtonToRender()}
					</div>
					<div className="headerMoreBtn" ref={moreWindowRef}>
						<button onClick={!isMobile ? () => setOpenMoreWindow(!openMoreWindow) : () => { toggleModal(); setContent(<AuthorMoreWindow data={data} />) }}>
							<Hint text={"more"} direction={"bottom"} />
							<FiMoreVertical />
						</button>
						{openMoreWindow ?
							(
								<div className="songItemMenuWindow" style={{ top: '110%', bottom: 'auto' }} onClick={e => e.stopPropagation()} >
									<div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<FriendsListToShareWith item={data} whatToShare={data.authors !== undefined ? 'playlist' : 'author'} />) }}>
										<FiShare />Share
									</div>
									<div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<h2>test</h2>) }}><FiInfo />Info</div>
									<div className="songItemMenuWindowItem"><FiFlag />Flag</div>
								</div>
							) :
							null
						}
					</div>
				</div>
				{
					currentUser.uid === data.uid ?
						<button onClick={logout} >
							<Hint text={"quit"} direction={"bottom"} />
							<IoMdExit />
						</button> :
						null
				}
			</div>
			<div style={{ transform: `translateX(${deltaX}px)`, transition:transformTransition + 's', opacity: 1 - Math.abs(deltaX / 200) }}> 
				{mobileCurrentPage === 0 ?
					<div >
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
									{editButton()}
									{/* <LastSongListened data = {data}/> */}

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
							{isFriend ? <ChatWithFriendButton data={data} color={headerColors[3]} /> : null}
						</div>
					</div> : 
					<div>
						hello
					</div>
				}
			</div>
			{isMobile ? <CirclePages amountOfPages={[1, 2]} currentPage={mobileCurrentPage} /> : null}
		</div>
	)
}
