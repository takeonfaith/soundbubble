import React from 'react'
import { useScreen } from '../../functionality/ScreenContext'

export const Hint = ({text, direction = "top"}) => {
	const {isMobile} = useScreen()
	const style = direction === 'top'?{
		bottom:'110%',
		left:'50%', 
		transform:'translateX(-50%)'
	}:direction === 'bottom'?{
		top:'120%',
		left:'50%', 
		transform:'translateX(-50%)'
	}:direction === 'left'?{
		top:'50%',
		left:'-100%', 
		transform:'translateY(-50%)'
	}:
	{
		top:'50%',
		right:'-100%', 
		transform:'translateY(-50%)'
	}
	return !isMobile?(
		<div className = "Hint" style = {style}>
			<h5>{text}</h5>
		</div>
	):null
}
