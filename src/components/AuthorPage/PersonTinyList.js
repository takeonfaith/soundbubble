import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase';
import { PersonTinyVerticalItem } from './PersonTinyVerticalItem'

export const PersonTinyList = ({data, title}) => {
	const [listOfPeople, setListOfPeople] = useState([])

	function fetchFriends(){
		setListOfPeople([])
		data.friends.forEach(async personObj => {
			if(personObj.status === 'added'){
				const personData = (await firestore.collection('users').doc(personObj.uid).get()).data()
				setListOfPeople(prev=>[...prev, personData])
			}
		});
	}
	useEffect(() => {
		setListOfPeople([])
		fetchFriends()
	}, [data.uid])
	return (
		<div className = 'PersonTinyList'>
			{title && <h2>{title}</h2>}
			<div className="personTinyListWrapper">
				{listOfPeople.map((person, index)=>{
					return <PersonTinyVerticalItem person = {person} key = {index}/>
				})}
			</div>
		</div>
	)
}
