import React from 'react'

export const Loading = ({currentTime, timeSpan, id}) => {
	return (
		<div className = "Loading" id = {id}>
			<div className="outer" style = {{pointerEvents:'none'}}>
				<div className="inner" style = {currentTime/timeSpan < 1?{width:(currentTime/timeSpan)*100 + "%"}:{width:0 + "%", opacity:'0'}}></div>
			</div>
		</div>
	)
}
