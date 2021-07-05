import React from 'react'
import { FiXCircle } from 'react-icons/fi'

export const SuccessPlate = ({text = "Success!", showPlate, setShowPlate}) => {
	return showPlate?(
		<div className = "SuccessPlate">
			{text}
			<button onClick = {()=>setShowPlate(false)}>
				<FiXCircle/>
			</button>
		</div>
	):null
}
