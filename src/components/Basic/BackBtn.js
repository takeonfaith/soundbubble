import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router'

export const BackBtn = ({color = ""}) => {
	const history = useHistory()
	return (
		<div className = "BackBtn">
			<button onClick={() => history.goBack()} style = {color.length?{color:color}:{}}>
				<FiArrowLeft />
			</button>
		</div>
	)
}
