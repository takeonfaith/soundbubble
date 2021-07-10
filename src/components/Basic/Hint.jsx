import React from 'react'
import { useScreen } from '../../contexts/ScreenContext'

export const Hint = ({text, direction = "top"}) => {
	const {isMobile} = useScreen()
	return !isMobile?(
		<div className = {"Hint " + direction}>
			<h5>{text}</h5>
		</div>
	):null
}
