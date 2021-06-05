import React from 'react'
import { Link } from 'react-router-dom'

export const PersonTinyVerticalItem = ({person}) => {
	return (
		<Link to = {`/authors/${person.uid}`}>
			<div className = "PersonTinyVerticalItem">
				<div className="personTinyImage">
					<img src={person.photoURL} alt="" />
				</div>
				<div className="personTinyName">
					{person.displayName}
				</div>
			</div>
		</Link>
	)
}
