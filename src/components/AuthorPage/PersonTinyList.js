import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { firestore } from '../../firebase';
import { PersonTinyVerticalItem } from './PersonTinyVerticalItem'

export const PersonTinyList = ({data, title}) => {
	const [listOfPeople, setListOfPeople] = useState([])
	const [scrollLeft, setScrollLeft] = useState(0)
	const wrapperRef = useRef(null)
	const [shouldRenderRightArrow, setShouldRenderRightArrow] = useState(false)
	function scrollToLeft() {
		const prev = wrapperRef.current.scrollLeft
		wrapperRef.current.scrollLeft = prev - 200
		setScrollLeft(prev - 200)
	}
	function scrollToRight() {
		const prev = wrapperRef.current.scrollLeft
		wrapperRef.current.scrollLeft = prev + 200
		setScrollLeft(prev + 200)
	}

	useEffect(() => {
		if(listOfPeople.length > 0){
			const scrollBiggerThanScreen = wrapperRef.current.scrollWidth > wrapperRef.current.offsetWidth
			if (scrollBiggerThanScreen) setShouldRenderRightArrow(true)
		}
	}, [listOfPeople])

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
	return listOfPeople.length > 0? (
		<div className = 'PersonTinyList'>
			{title && <h2>{title}</h2>}
			<div style = {{position:'relative'}}>	
				<div className="personTinyListWrapper" ref = {wrapperRef} onScroll={e => setScrollLeft(e.target.scrollLeft)}>
					{listOfPeople.map((person, index)=>{
						return <PersonTinyVerticalItem person = {person} key = {person.uid}/>
					})}
				</div>
				<div className="authorsShiftButtons">
					<button onClick={scrollToLeft} style={scrollLeft <= 0 ? { visibility: 'hidden', opacity: '0' } : {}}><FiChevronLeft /></button>
					<button onClick={scrollToRight} style={shouldRenderRightArrow && (wrapperRef.current.scrollWidth - wrapperRef.current.offsetWidth !== scrollLeft)? {} : { visibility: 'hidden', opacity: '0' }}><FiChevronRight /></button>
				</div>
			</div>
		</div>
	):null
}
