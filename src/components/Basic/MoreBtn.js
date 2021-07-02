import React from 'react'

export const MoreBtn = ({func, lenOfList, maxLen = 5, boolVal}) => {
	return (
		<div onClick = {lenOfList > maxLen?func:null} className = "MoreBtn" style = {lenOfList <= maxLen?{display:'none'}:{}}>
			<button style = {boolVal?{background:'var(--pink)', color:'#ff8db2'}:{}}>
				{boolVal?"Close":"More"}
			</button>
		</div>
	)
}
