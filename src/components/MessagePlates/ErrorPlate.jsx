import React from 'react'

export const ErrorPlate = ({errorMessage}) => {
	return errorMessage && (
		<div className="Alert">
			{errorMessage}
		</div>
	)
}
