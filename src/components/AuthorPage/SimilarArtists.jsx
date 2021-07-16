import React, { useEffect, useState } from 'react'
import findSimilarArtists from '../../functions/find/findSimilarArtists'
import { AuthorsList } from '../Lists/AuthorsList'

export const SimilarArtists = ({ data }) => {
	const [similarArtists, setSimilarArtists] = useState([])

	useEffect(() => {
		findSimilarArtists(data, setSimilarArtists)
	}, [data])
	return (
		<AuthorsList listOfAuthors = {similarArtists} title = {"Similar Authors"}/>
	)
}
