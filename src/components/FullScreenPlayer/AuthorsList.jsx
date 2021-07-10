import React from 'react'
import { useSong } from '../../contexts/SongContext'

export const AuthorsList = ({listOfAuthors}) => {
	const { displayAuthorsFull } = useSong()
	return (
		<div className="rightSideAuthorsList" >
			<div className="rightSideAuthorsListCentralBlock">
				{displayAuthorsFull(listOfAuthors)}
			</div>
		</div>
	)
}
