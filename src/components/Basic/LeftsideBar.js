import React, { useState } from 'react'
import { leftSideBar } from '../../data/leftSideBar'
import NavigationItem from '../LeftsideBar/NavigationItem'
import Logo from "../../images/Logo3.svg"
import '../../styles/LeftsideBar.css'
import { friends } from '../../data/friends'
import { Player } from '../FullScreenPlayer/Player'
import { BiFullscreen } from 'react-icons/bi'
import { useSong } from '../../functionality/SongPlay/SongContext'
import normalizeString from '../../functions/normalizeString'
import { Link } from 'react-router-dom'
import { authors } from '../../data/authors'
import shareWithOneFriend from '../../functions/shareWithOneFriend'
export const LeftsideBar = () => {
	const {
		leftSideBarInputRef,
		setOpenFullScreenPlayer, 
		currentSong
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
				<Link to = '/authors/kostya-doloz'>
					<div className="person">
						<div className="pesronImg">
							<img src="https://sun9-66.userapi.com/impf/c636628/v636628089/46fc5/jZmb1Eadwqs.jpg?size=960x1280&quality=96&sign=ee424378e70207bd5f8ab2aa5a669b81&type=album" alt="" />
						</div>
						<div className="personName">
							Kostya Doloz
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
				{friends['30'].map((friendId, index) => {
					let friend = authors[friendId]
					if (index <= 2) {
						return (
							<div className="person" key={index} id = {friendId} onClick = {(e)=>shareWithOneFriend(e, currentSong)} >
								<div className="pesronImg" style = {{pointerEvents:'none'}}>
									<img src={friend.image} alt="" />
								</div>
								<div className="personName" style = {{pointerEvents:'none'}}>
									{friend.name}
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
