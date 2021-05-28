import React from 'react'
import {IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline, IoIosRadioButtonOff} from 'react-icons/io'
export const PersonTiny = ({data, chosenArray, showChoose,...restProps}) => {
	return (
		<div className="person" {...restProps}>
			{showChoose?chosenArray.includes(data.uid)?<IoIosCheckmarkCircle style = {{color:'var(--lightBlue)'}}/>:<IoIosRadioButtonOff/>:null}
			<div className="pesronImg">
				<img src={data.photoURL} alt="" />
			</div>
			<div className="personName">
				{data.displayName}
			</div>
		</div>
	)
}
