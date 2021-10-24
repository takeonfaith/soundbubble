import React from 'react'
import { Link } from 'react-router-dom'

export default function NavigationItem({id, title, icon, link, currentPage, setCurrentPage}) {
	return (
		<Link to = {link}>
			<div className={"NavigationItem " + (id === currentPage?"active":"")} onClick={() => setCurrentPage(id)}>
				<div className="icon">{icon}</div>
				<b>{title}</b>
			</div>
		</Link>
	)
}
