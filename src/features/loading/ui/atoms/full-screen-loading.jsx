import React from 'react'

export const FullScreenLoading = ({loading}) => {
	return (
		<div className = "FullScreenLoading" style = {loading?{}:{opacity:'0', visibility:'hidden'}}>
			<img loading = "lazy" src="https://icon-library.com/images/spinner-icon-gif/spinner-icon-gif-28.jpg" alt=""/>
		</div>
	)
}
