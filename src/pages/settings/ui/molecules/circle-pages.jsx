import React from 'react'

export const CirclePages = ({amountOfPages, currentPage}) => {
	return (
		<div className = "CirclePages">
			{amountOfPages.map((_, index)=>{
				return (
					<div className="circleItem" style = {index === currentPage?{background:'var(--reallyLightBlue)'}:{}}></div>
				)
			})}
		</div>
	)
}
