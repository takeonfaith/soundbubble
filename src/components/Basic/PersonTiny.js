import React from 'react'
import { AddToListCircle } from './AddToListCircle'
export const PersonTiny = ({data, chosenArray, setChosenArray, ...restProps}) => {
	return (
		<div className="person" {...restProps}>
			<AddToListCircle listOfChosenItems = {chosenArray} setListOfChosenItems = {setChosenArray} itemId = {data.uid}/>
			<div className="pesronImg">
				<img src={data.photoURL} alt="" />
			</div>
			<div className="personName">
				{data.displayName}
			</div>
		</div>
	)
}
