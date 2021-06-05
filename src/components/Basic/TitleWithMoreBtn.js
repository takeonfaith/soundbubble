import React from 'react'
import { MoreBtn } from './MoreBtn'

export const TitleWithMoreBtn = ({title, func, boolVal, lenOfList, maxLen = 5, marginBottom = 0}) => {
	return lenOfList !== 0?(
		<div className="topTitle">
			<h2 style = {{marginBottom:marginBottom}}>{title}</h2>
			<MoreBtn func={func} boolVal={boolVal} lenOfList={lenOfList} maxLen = {maxLen}/>
		</div>
	):null
}
