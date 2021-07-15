import React from 'react'
import displayDate from '../../functions/display/displayDate'

export const DateOnTop = ({date}) => {
	return (
		<div className = "DateOnTop">
			{displayDate(date)}
		</div>
	)
}
