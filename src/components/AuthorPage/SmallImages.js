import React, {useEffect} from 'react'

export const SmallImages = ({imagesList, borderColor = "#fff"}) => {
	return (
		<div className = "SmallImages" style = {{marginRight:-7*(imagesList.length-1)}}>
			{imagesList.map((image, index)=>{
				return (
					<div className = "smallImgContainer" style = {{border:`3px solid ${borderColor}`, transform:`translateX(${-15*index}px)`}} key = {index}>
						<img src={image} alt=""/>
					</div>
				)
			})}
		</div>
	)
}
