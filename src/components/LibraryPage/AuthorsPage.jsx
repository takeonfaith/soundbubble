import React, { useState } from 'react'
import { useSong } from '../../contexts/SongContext'
import {AuthorItemBig} from '../AuthorPage/AuthorItemBig'
import { SearchBar } from '../Basic/SearchBar'
export const AuthorsPage = () => {
	const {yourAuthors} = useSong()
	const [searchValue, setSearchValue] = useState("")
	const [displayAuthors, setDisplayAuthors] = useState(yourAuthors)
	return (
		<div className = "AuthorsPage">
			<SearchBar value = {searchValue} setValue = {setSearchValue} setResultAuthorList = {setDisplayAuthors} defaultSearchMode = {"authors"} defaultAuthorsListValue = {yourAuthors}/>
			<div className="authorsContainer">
				{displayAuthors.map((authorData)=>{
					return <AuthorItemBig data = {authorData} key = {authorData.uid}/>
				})}
			</div>
		</div>
	)
}
