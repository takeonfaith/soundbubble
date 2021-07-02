import React from 'react'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/normalizeString'
import { AddToListCircle } from '../Basic/AddToListCircle'

export const AuthorItemBig = ({data, listOfChosenAuthors, setListOfChosenAuthors}) => {
	return (
		<Link to = {`/authors/${data.uid}`} className = "AuthorItemBig">
			<AddToListCircle listOfChosenItems = {listOfChosenAuthors} setListOfChosenItems = {setListOfChosenAuthors} itemId = {data.uid}/>
			<div >
				<div className = "AuthorItemBigImage">
					<img src={data.photoURL} alt=""/>
				</div>
				<h3>{data.displayName}</h3>
			</div>
		</Link>
	)
}
