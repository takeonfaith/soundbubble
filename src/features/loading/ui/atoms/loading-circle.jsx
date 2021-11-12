import React from 'react'

export const LoadingCircle = ({top = '20%'}) => {
	return (
		<div className = "LoadingCircle" style = {{top:top}}>
			<img loading = "lazy" src="https://icon-library.com/images/spinner-icon-gif/spinner-icon-gif-28.jpg" alt=""/>
		</div>
	)
}
