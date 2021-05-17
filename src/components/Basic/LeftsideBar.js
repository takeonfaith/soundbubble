import React, { useEffect, useState } from 'react'
import { leftSideBar } from '../../data/leftSideBar'
import NavigationItem from '../LeftsideBar/NavigationItem'
import Logo from "../../images/Logo3.svg"
import '../../styles/LeftsideBar.css'
import { friends } from '../../data/friends'
import { Player } from '../FullScreenPlayer/Player'
import { BiFullscreen, BiShare } from 'react-icons/bi'
import { useSong } from '../../functionality/SongPlay/SongContext'
import normalizeString from '../../functions/normalizeString'
import { Link } from 'react-router-dom'
import { authors } from '../../data/authors'
import shareWithOneFriend from '../../functions/shareWithOneFriend'
import { useAuth } from '../../functionality/AuthContext'
import { firestore } from '../../firebase'
import { FiUser } from 'react-icons/fi'
export const LeftsideBar = () => {
	const {currentUser} = useAuth()
	const {
		leftSideBarInputRef,
		setOpenFullScreenPlayer, 
		currentSong,
		yourFriends
	} = useSong()
	const [currentPage, setCurrentPage] = useState(
		() => {
			let page = leftSideBar.find((el, i) => {
				if (window.location.pathname.includes(normalizeString(el.title))) {
					return true
				}

				return false
			})
			return page === undefined?0:page.id 
		}
	)
	
	return (
		<div className="LeftsideBar">
			<div className="logo">
				<img src={Logo} alt="" />
				<h3>Soundbubble</h3>
			</div>
			<div className="leftSideBarContainer">
				<Link to = {`/authors/${currentUser.uid}`}>
					<div className="person">
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
			<div className="leftSideBarContainer">
				{yourFriends.map((friend, index) => {
					if (index <= 2) {
						return (
							<div className="person" key={index} id = {friend.uid} >
								<div className="personBtns">
									<Link to = {`/authors/${friend.uid}`}>
										<button><FiUser/></button>
									</Link>
									<button onClick = {(e)=>shareWithOneFriend(e, currentSong)}><BiShare/></button>
								</div>
								<div className="pesronImg" style = {{pointerEvents:'none'}}>
									<img src={friend.photoURL} alt="" />
								</div>
								<div className="personName" style = {{pointerEvents:'none'}}>
									{friend.displayName}
								</div>
								
							</div>
						)
					}
					return null
				})}
				<h4 className = "seeMoreBtn">See more</h4>
			</div>
			<div className="leftSideBarContainer">
				<div className="littlePlayer">
					<Player textLimit={15} inputRef={leftSideBarInputRef} />
					<div className="fullScreenBtn" onClick={() => setOpenFullScreenPlayer(true)}>
						<BiFullscreen />
					</div>
				</div>
			</div>
		</div>
	)
}
