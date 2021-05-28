import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import {AuthorItemBig} from '../AuthorPage/AuthorItemBig'
export const AuthorsPage = () => {
	const {yourAuthors} = useSong()
	return (
		<div className = "AuthorsPage">
			<div className="authorsContainer">
				{yourAuthors.map((authorData, index)=>{
					return <AuthorItemBig data = {authorData} key = {index}/>
				})}
			</div>
		</div>
	)
}
