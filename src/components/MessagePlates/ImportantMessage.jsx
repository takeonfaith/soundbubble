import React from 'react'

export const ImportantMessage = ({message, image, button}) => {
	return (
		<div className = "importantMessage">
			<div>
				{image?<img loading = "lazy" src={image} alt="" />:null}
				<h3>{message}</h3>
				{button?button:null}
			</div>
		</div>
	)
}
