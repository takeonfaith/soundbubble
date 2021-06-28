import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import {AuthorItemBig} from '../AuthorPage/AuthorItemBig'
export const AuthorsPage = () => {
	const {yourAuthors} = useSong()
	return (
		<div className = "AuthorsPage">
			<div className="authorsContainer">
				{yourAuthors.map((authorData)=>{
					return <AuthorItemBig data = {authorData} key = {authorData.uid}/>
				})}
			</div>
		</div>
	)
}
