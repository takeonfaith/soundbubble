import React from 'react'

export const RadioBtn = ({currentActive, id, label, onClick}) => {
	return (
		<div className = "RadioBtn" id = {id} onClick = {onClick}>
			<span className = "radioLabel" style = {currentActive === id?{color:'var(--blue)', opacity:1, fontWeight:'bold'}:{}}>
				{label}
			</span>
			<span className = "radioCircle" style = {currentActive === id?{background:'var(--blue)'}:{}}></span>
		</div>
	)
}
