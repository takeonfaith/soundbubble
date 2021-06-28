import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'

export const AuthorsList = () => {
	const { displayAuthorsFull } = useSong()
	return (
		<div className="rightSideAuthorsList" >
			<div className="rightSideAuthorsListCentralBlock">
				{displayAuthorsFull()}
			</div>
		</div>
	)
}
