import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Header } from '../components/AuthorPage/Header'
import { Playlists } from '../components/AuthorPage/Playlists'
import { SimilarArtists } from '../components/AuthorPage/SimilarArtists'
import { TopSongs } from '../components/AuthorPage/TopSongs'
import { authors } from '../data/authors'
import normalizeString from '../functions/normalizeString'
import "../styles/AuthorPage.css"
export const AuthorPage = () => {
	const match = useRouteMatch('/authors/:author')
	const [headerColors, setHeaderColors] = useState([])
	const { author } = match.params
	const [authorsData, setAuthorsData] = useState([])
	useEffect(() => {
		authors.find((a) => {
			if (normalizeString(a.name) === author) return setAuthorsData(a)
		})
	}, [author])
	return (
		<div className="AuthorPage" style = {{animation:'zoomIn .2s forwards'}}>
			<Header data={authorsData} headerColors = {headerColors} setHeaderColors = {setHeaderColors}/>
			<TopSongs author = {author} authorsData={authorsData} headerColors = {headerColors}/>
			<Playlists authorsData={authorsData} headerColors = {headerColors}/>
			<SimilarArtists data = {authorsData}/>
		</div>
	)
}
