import React, { useRef, useState } from 'react'
import { FiEdit2, FiHeadphones, FiInfo, FiMoreVertical, FiPlusCircle, FiSettings, FiShare, FiTrash, FiUserCheck, FiUserPlus } from 'react-icons/fi'
import { ImCheckmark } from 'react-icons/im'
import { useSong } from '../../contexts/SongContext'
import displayDate from '../../functions/display/displayDate'
import { BackBtn } from '../Buttons/BackBtn'
import { SmallImages } from './SmallImages'
import { useAuth } from '../../contexts/AuthContext'
import { IoMdExit } from 'react-icons/io'
import rightFormanForBigNumber from '../../functions/other/rightFormatForBigNumber'
import { CgCheckO, CgLock } from 'react-icons/cg'
import { useModal } from '../../contexts/ModalContext'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { ChatWithFriendButton } from './ChatWithFriendButton'
import { BiAlbum, BiDoorOpen, BiLoaderAlt } from 'react-icons/bi'
import { FriendsListToShareWith } from '../Lists/FriendsListToShareWith'
import { CustomizeAlbum } from '../AlbumPage/CustomizeAlbum'
import { CustomizeAuthor } from '../AuthorPage/CustomizeAuthor'
import { addAuthorToLibrary } from '../../functions/add/addAuthorToLibrary'
import addFriend from '../../functions/add/addFriend'
import { LastSongListened } from './LastSongListened'
import { LastSeen } from '../Basic/LastSeen'
import { addPlaylistToLibrary } from '../../functions/add/addPlaylistToLibrary'
import { removePlaylistFromLibrary } from '../../functions/other/removePlaylistFromLibrary'
import { SettingsList } from '../Settings/SettingsList'
import { Hint } from '../Basic/Hint'
import { useScreen } from '../../contexts/ScreenContext'
import { AuthorMoreWindow } from '../Windows/AuthorMoreWindow'
import { AlbumInfo } from '../Info/AlbumInfo'
import { AuthorInfo } from '../Info/AuthorInfo'
import { deleteFriend } from '../../functions/delete/deleteFriend'
import { useAlbumAuthors } from '../../hooks/useAlbumAuthors'
import { deletePlaylist } from '../../functions/delete/deletePlaylist'
import { quitPlaylist } from '../../functions/other/quitPlaylist'
export const Header = ({ data, headerColors }) => {
	const { isMobile } = useScreen()
	const { displayAuthors } = useSong()
	const [albumAuthors, authorsImages] = useAlbumAuthors(data)
	const { currentUser, logout } = useAuth()
	const [openMoreWindow, setOpenMoreWindow] = useState(false)
	const { toggleModal, setContent, openConfirm, closeConfirm } = useModal()
	const isFriend = currentUser.friends.find(friend => (friend.uid === data.uid && friend.status === 'added'))
	const moreWindowRef = useRef(null)
	useOutsideClick(moreWindowRef, setOpenMoreWindow)

	function displayCreationDateIfExists() {
		return data.creationDate !== undefined ?
			<div className="headerListenersAndSubsItem">
				<Hint text={"creation date"} style={{ fontSize: "0.8em" }} />
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


	function whatButtonToRender() {
		if (data.authors) {
			if (currentUser.ownPlaylists.includes(data.id) && data.authors.length === 1) return <button onClick={() => openConfirm("Are you sure you want to DELETE this playlist forever?!", "Yes, pretty sure", "No, I Don't!", () => { deletePlaylist(data.id); closeConfirm() })}><Hint text={"delete playlist"} direction={"bottom"} /><FiTrash /></button>
			else if (currentUser.ownPlaylists.includes(data.id)) return <button onClick={() => openConfirm("Are you sure you want to quit this playlist?", "Yes, pretty sure", "No, I Don't!", () => { quitPlaylist(data, currentUser); closeConfirm() })}><Hint text={"quit playlist"} direction={"bottom"} /><BiDoorOpen /></button>
			else if (currentUser.addedPlaylists.includes(data.id)) return <button onClick={() => openConfirm("Are you sure you want to remove this playlist from library?", "Yes, pretty sure", "No-no-no, go away", () => { removePlaylistFromLibrary(data, currentUser); closeConfirm() })}><Hint text={"remove playlist from library"} direction={"bottom"} /><CgCheckO /></button>
			else return <button onClick={() => addPlaylistToLibrary(data, currentUser)}><Hint text={"add playlist"} direction={"bottom"} /><FiPlusCircle /></button>
		}
		else {
			if (currentUser.addedAuthors.includes(data.uid)) return <button><Hint text={"remove author from library"} direction={"bottom"} /><CgCheckO /></button>
			else if (currentUser.uid === data.uid) return <button onClick={() => { toggleModal(); setContent(<SettingsList />) }}><Hint text={"settings"} direction={"bottom"} /><FiSettings /></button>
			else if (!data.isAuthor && currentUser.friends.find(friend => friend.uid === data.uid && friend.status === 'added')) return <button onClick={() => openConfirm("Are you sure you want to remove this person from friend list?", "Yes, pretty sure", "No-no-no, go away", () => { deleteFriend(currentUser, data); closeConfirm() })}><Hint text={"remove from friend list"} direction={"bottom"} /><FiUserCheck /></button>
			else if (!data.isAuthor && currentUser.friends.find(friend => ((friend.uid === data.uid) && (friend.status === 'awaiting')))) return <button onClick={addFriend}><Hint text={"waiting for response"} direction={"bottom"} /><BiLoaderAlt style={{ animation: 'loading 1s infinite linear' }} /></button>
			else if (!data.isAuthor) return <button onClick={() => addFriend(data, currentUser)}><Hint text={"add friend"} direction={"bottom"} /><FiUserPlus /></button>
			else return <button onClick={() => addAuthorToLibrary(data, currentUser)}><Hint text={"subscribe"} direction={"bottom"} /><FiPlusCircle /></button>
		}
	}

	function findIfIsPrivate() {
		return data.isPrivate ? <CgLock /> : null
	}

	return (
		<div className="Header" style={headerColors.length ? { background: `linear-gradient(45deg, ${headerColors[2]}, ${headerColors[0]})` } : { background: 'var(--yellowAndPinkGrad)' }}>
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
									{
										(data.authors && data.authors.find(person => person.uid === currentUser.uid)) || (data.authors && currentUser.isAdmin) ? <div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<CustomizeAlbum playlist={data} />) }}><FiEdit2 />Edit</div> :
										(data.uid === currentUser.uid && !data.isAuthor) ? <div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<CustomizeAuthor author={data} />) }}><FiEdit2 />Edit</div> :
										null
									}
									<div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<FriendsListToShareWith item={data} whatToShare={data.authors !== undefined ? 'playlist' : 'author'} />) }}>
										<FiShare />Share
									</div>
									<div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(data.authors !== undefined ? <AlbumInfo album={data} /> : <AuthorInfo author={data} />) }}><FiInfo />Info</div>
								</div>
							) :
							null
						}
					</div>
				</div>
				{
					currentUser.uid === data.uid ?
						<button onClick={() => openConfirm("Are you sure you want to quit?", "Yes, pretty sure", "No, I Don't!", () => { logout(); closeConfirm() })} >
							<Hint text={"quit"} direction={"bottom"} />
							<IoMdExit />
						</button> :
						null
				}
			</div>
			<div className="headerAuthorsImage" style={data.authors === undefined ? { animation: "floatingBorderRadius 10s infinite ease-in-out", backgroundImage: `url(${data.photoURL})`, position:'relative' } : { backgroundImage: `url(${data.image})`, position:'relative', backgroundColor:'var(--red)' }}>
			{data.authors !== undefined && !data.image?<BiAlbum style = {{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)', width:'60px', height:'60px'}}/>:null}
			</div>
			<div className="headerAuthorInfo">
				<div className="headerAuthorsName">
					{isAlbumOrIsAuthor()}
					<div style={{ display: 'flex', alignItems: 'center', margin: "2px 0 10px 0" }}>
						<h1>{data.displayName || data.name}</h1>
						{findIfIsVerified()}
						{findIfIsPrivate()}
						{/* <LastSongListened data = {data} loading = {loading}/> */}

					</div>
				</div>
				{showCreatorsIfExist()}

				<div className="headerListenersAndSubs">
					<div className="headerListenersAndSubsItem">
						<Hint text={(data.listens ?? data.numberOfListenersPerMonth) + ' listeners per month'} style={{ fontSize: "0.8em" }} />
						<span>{rightFormanForBigNumber(data.listens ?? data.numberOfListenersPerMonth)}</span>
						<FiHeadphones />
					</div>
					<div className="headerListenersAndSubsItem">
						<Hint text={data.subscribers + ' subscribers'} style={{ fontSize: "0.8em" }} />
						<span>{rightFormanForBigNumber(data.subscribers)}</span>
						<FiUserPlus />
					</div>
					{displayCreationDateIfExists()}
				</div>
				{isFriend ? <ChatWithFriendButton data={data} color={headerColors[3]} /> : null}
			</div>
		</div>
	)
}
