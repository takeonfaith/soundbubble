import React from 'react'

export const SeenByCircle = ({listOfSeen}) => {
	return (
		<div className = "SeenByCircle" style = {listOfSeen !== undefined? listOfSeen.length <= 1?{opacity:'1', visibility:'visible'}:{}:null}></div>
	)
}
