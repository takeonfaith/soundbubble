import React from 'react'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/normalizeString'

export const AuthorItemBig = ({data}) => {
	return (
		<Link to = {`/authors/${data.uid}`} className = "AuthorItemBig">
			<div >
				<div className = "AuthorItemBigImage">
					<img src={data.photoURL} alt=""/>
				</div>
				<h3>{data.displayName}</h3>
			</div>
		</Link>
	)
}
