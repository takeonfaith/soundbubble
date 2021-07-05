import React, { useState } from 'react'
import { leftSideBar } from '../../data/leftSideBar'
import NavigationItem from '../LeftsideBar/NavigationItem'
import Logo from "../../images/Logo3.svg"
import '../../styles/LeftsideBar.css'
import { Player } from '../FullScreenPlayer/Player'
import { BiFolderPlus, BiFullscreen} from 'react-icons/bi'
import { useSong } from '../../functionality/SongPlay/SongContext'
import normalizeString from '../../functions/normalizeString'
import { Link } from 'react-router-dom'
import { useAuth } from '../../functionality/AuthContext'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useModal } from '../../functionality/ModalClass'
import { FriendsListToShareWith } from './FriendsListToShareWith'
import { Person } from '../LeftsideBar/Person'
import { CreatePlaylistPage } from '../LibraryPage/CreatePlaylistPage'
import { TinyPlaylist } from '../LeftsideBar/TinyPlaylist'
import { NotificationCircle } from './NotificationCircle'
export const LeftsideBar = () => {
	const { currentUser } = useAuth()
	const {
		leftSideBarInputRef,
		setOpenFullScreenPlayer,
		currentSongData,
		yourFriends,
		yourPlaylists
	} = useSong()
	const { toggleModal, setContent } = useModal()
	const [currentFriendToPlaylistPage, setCurrentFriendToPlaylistPage] = useState(0)
	const [currentPage, setCurrentPage] = useState(
		() => {
			let page = leftSideBar.find((el, i) => {
				console.log(window.location.hash)
				if (window.location.hash.includes(normalizeString(el.title))) {
					return true
				}

				return false
			})
			return page === undefined ? 0 : page.id
		}
	)
	return (
		<div className="LeftsideBar">
			<div className="logo">
				<img src={Logo} alt="" />
				<h3>Soundbubble</h3>
			</div>
			<div className="leftSideBarContainer">
				<Link to={`/authors/${currentUser.uid}`}>
					<div className="person">
						{currentUser.friends.some(friend=>friend.status === 'requested')?<NotificationCircle/>:null}
						<div className="pesronImg">
							<img src={currentUser.photoURL} alt="" />
						</div>
						<div className="personName">
							{currentUser.displayName}
						</div>
					</div>
				</Link>
			</div>
			<div className="NavigationPanel">
				{leftSideBar.map(({ id, title, icon, link }, index) => {
					return (
						<NavigationItem key={index} id={id} title={title} icon={icon} link={link} currentPage={currentPage} setCurrentPage={setCurrentPage} />
					)
				})}
			</div>
			<div className="leftSideBarContainer friendsAndPlaylists">
				<span style={{display: !currentFriendToPlaylistPage ? "block" : "none", animation: 'scrollFromBottom .2s forwards' }}>
					{
						yourFriends.length > 0?
						<>
						{yourFriends.map((friend, index) => {
							if (index <= 2) {
								return (
									<Person index={friend.uid} friend={friend}/>
								)
							}
							return null
						})}
						<h4 className="seeMoreBtn" onClick={() => { toggleModal(); setContent(<FriendsListToShareWith item={currentSongData} whatToShare = {"song"}/>) }}>See more</h4>
						</>:
						<h4 style = {{alignSelf:'center',width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>No friends added</h4>
					}
					
				</span>
				<span style={{display: currentFriendToPlaylistPage ? "block" : "none", animation: 'scrollFromTop .2s forwards' }}>
					{yourPlaylists.map((playlist, index) => {
						if (index <= 2) {
							return <TinyPlaylist playlist = {playlist} key = {playlist.id}/>
						}
					})}
					<button className="createPlaylistBtn" onClick={() => { toggleModal(); setContent(<CreatePlaylistPage />) }} style = {{margin:'5px 0'}}>
						<BiFolderPlus />
						Create Playlist
					</button>
				</span>
				<div className="upAndDownBtns">
					<button onClick={() => setCurrentFriendToPlaylistPage(0)} style={!currentFriendToPlaylistPage ? { opacity: '0.3' } : {}}><FiChevronUp /></button>
					<button onClick={() => setCurrentFriendToPlaylistPage(1)} style={currentFriendToPlaylistPage ? { opacity: '0.3' } : {}}><FiChevronDown /></button>
				</div>
			</div>
			<div className="leftSideBarContainer">
				{
					(Object.keys(currentSongData).length === 0 && currentSongData.constructor === Object) || currentSongData.id === -1?
					null:<div className="littlePlayer">
						<Player textLimit={15} inputRef={leftSideBarInputRef} />
						<div className="fullScreenBtn" onClick={() => setOpenFullScreenPlayer(true)}>
							<BiFullscreen />
						</div>
					</div>
				}
			</div>
		</div>
	)
}
