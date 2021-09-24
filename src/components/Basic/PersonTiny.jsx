import React from 'react'
import { AddToListCircle } from '../Tools/AddToListCircle'
export const PersonTiny = ({data, chosenArray, setChosenArray, ...restProps}) => {
	return (
		<div className="person" {...restProps}>
			<AddToListCircle listOfChosenItems = {chosenArray} setListOfChosenItems = {setChosenArray} itemId = {data.uid}/>
			<div className="pesronImg">
				<img loading = "lazy" src={data.photoURL} alt="" />
			</div>
			<div className="personName">
				{data.displayName}
			</div>
		</div>
	)
}