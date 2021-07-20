import React from 'react'
import {IoIosCheckmarkCircle, IoIosRadioButtonOff} from 'react-icons/io'

export const AddToListCircle = ({listOfChosenItems, setListOfChosenItems, itemId}) => {
	return listOfChosenItems !== undefined ? (
		<div onClick = {e=>e.preventDefault()} style = {{width:'35px'}}>
			{
				listOfChosenItems.includes(itemId) ?
					<button type="button" onClick={(e) => { let filteredList = listOfChosenItems.filter(el => el !== itemId); setListOfChosenItems(filteredList) }} className="addToListBtn">
						<IoIosCheckmarkCircle style={{ color: 'var(--lightBlue)' }} />
					</button> :
					<button type="button" onClick={() => setListOfChosenItems(prev => [...prev, itemId])} className="addToListBtn">
						<IoIosRadioButtonOff />
					</button>
			}
		</div>
	) : null
}
