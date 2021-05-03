import React from 'react'
import { options } from '../../data/optionsPage'
import { OptionItem } from './OptionItem'

export const Options = () => {
	return (
		<div className = 'Options'>
			{options.map((option, index)=>{
				return (
					<OptionItem title = {option.title} icon = {option.icon} key = {index}/>
				)
			})}
		</div>
	)
}
