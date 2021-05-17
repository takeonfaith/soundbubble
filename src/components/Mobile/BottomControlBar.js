import React, { useState } from 'react'
import '../../styles/BottomControlBar.css'
import {leftSideBar} from '../../data/leftSideBar'
import { MobileControlBarItem } from '../BottomControlBar/MobileControlBarItem'
import { useAuth } from '../../functionality/AuthContext'
import { BiUserCircle } from 'react-icons/bi'
import normalizeString from '../../functions/normalizeString'
export const BottomControlBar = () => {
	const {currentUser} = useAuth()
	const userElement = {
		icon:<BiUserCircle/>,
		link:`/authors/${currentUser.uid}`,
	}
	const [currentPage, setCurrentPage] = useState(
		() => {
			let page = leftSideBar.find((el, i) => {
				if (window.location.pathname.includes(normalizeString(el.title))) {
					return true
				}

				if(window.location.pathname.includes(currentUser.uid)) return true

				return false
			})
			return page === undefined?0:page.id 
		}
	)
	
	return (
		<div className = "BottomControlBar">
			{leftSideBar.map((el, i)=>{
				return <MobileControlBarItem element = {el} key = {i} currentPage = {currentPage} setCurrentPage = {setCurrentPage}/>
			})}
			<MobileControlBarItem element = {userElement} currentPage = {currentPage} setCurrentPage = {setCurrentPage}/>
		</div>
	)
}
