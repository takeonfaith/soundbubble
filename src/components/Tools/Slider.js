import React from 'react'

export const Slider = ({pages, currentPage, setCurrentPage}) => {
	return (
		<div className = "Slider">
			{pages.map((pageName, index)=>{
				return (
					<div className = {"sliderItem " + (index === currentPage?"current":"")} key = {index} onClick = {()=>setCurrentPage(index)}>
						{pageName}
					</div>
				)
			})}
		</div>
	)
}
