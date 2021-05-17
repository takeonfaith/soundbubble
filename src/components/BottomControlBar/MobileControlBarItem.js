import React from 'react'
import { Link } from 'react-router-dom'

export const MobileControlBarItem = ({element, currentPage, setCurrentPage}) => {
	return (
		<Link to = {element.link} className = 'MobileControlBarItem' onClick = {()=>setCurrentPage(element.id)} style = {element.id === currentPage?{color:'var(--blue)'}:{}}>	
			{element.icon}
		</Link>
	)
}
