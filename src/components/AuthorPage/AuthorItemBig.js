import React from 'react'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/normalizeString'

export const AuthorItemBig = ({data}) => {
	return (
		<Link to = {`/authors/${normalizeString(data.name)}`} className = "AuthorItemBig">
			<div >
				<div className = "AuthorItemBigImage">
					<img src={data.image} alt=""/>
				</div>
				<h3>{data.name}</h3>
			</div>
		</Link>
	)
}
