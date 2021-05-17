import React, { useEffect, useState } from 'react'
import { authors } from '../../data/authors'
import { songs } from '../../data/songs'
import findSimilarArtists from '../../functions/findSimilarArtists'
import { AuthorItemBig } from './AuthorItemBig'

export const SimilarArtists = ({ data }) => {
	const [similarArtists, setSimilarArtists] = useState([])

	useEffect(() => {
		findSimilarArtists(data, setSimilarArtists)
	}, [data])
	return similarArtists.length?(
		<div className="SimilarArtists">
			<h2>Similar Authors</h2>
			<div className="artistsWrapper">
				{similarArtists.map((author, index)=>{
					if(index < 5){
						return (
							<AuthorItemBig data = {author} key = {index}/>
						)
					}
					return null
				})}
			</div>
		</div>
	)
	:null
	
}
