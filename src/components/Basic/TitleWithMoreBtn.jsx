import React from 'react'
import { MoreBtn } from '../Buttons/MoreBtn'

export const TitleWithMoreBtn = ({title, func, boolVal, lenOfList, maxLen = 5, marginBottom = 0}) => {
	return lenOfList !== 0?(
		<div className="topTitle" style = {{margin:'10px 0'}}>
			<h2 style = {{margin:marginBottom}}>{title}</h2>
			<MoreBtn func={func} boolVal={boolVal} lenOfList={lenOfList} maxLen = {maxLen}/>
		</div>
	):null
}
