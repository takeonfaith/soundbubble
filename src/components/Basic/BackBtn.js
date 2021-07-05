import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router'
import { Hint } from './Hint'
export const BackBtn = ({color = ""}) => {
	const history = useHistory()
	return (
		<div className = "BackBtn">
			<button onClick={() => history.goBack()} style = {color.length?{color:color}:{}}>
				<Hint text = {"go back"} direction = {"bottom"}/>
				<FiArrowLeft />
			</button>
		</div>
	)
}
