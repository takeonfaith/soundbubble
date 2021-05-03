import React from 'react'

export const Loading = ({currentTime, timeSpan}) => {
	return (
		<div className = "Loading">
			<div className="outer">
				<div className="inner" style = {currentTime/timeSpan < 1?{width:(currentTime/timeSpan)*100 + "%"}:{width:0 + "%", opacity:'0'}}></div>
			</div>
		</div>
	)
}
