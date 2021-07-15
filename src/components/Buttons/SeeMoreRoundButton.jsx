import React from 'react'
import { FiArrowRight } from 'react-icons/fi'

export const SeeMoreRoundButton = ({text = "See more", ...restProps}) => {
	return (
		<div className = "SeeMoreRoundButton" {...restProps}>
			<button>
				<FiArrowRight/>
			</button>
			<span>{text}</span>
		</div>
	)
}
