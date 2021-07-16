import React, { useEffect, useState } from 'react'

import "../styles/SearchPage.css"
import { SearchBar } from '../components/Basic/SearchBar'
import { useAuth } from '../contexts/AuthContext'
import { SongList } from '../components/Lists/SongList'
import { AuthorsList } from '../components/Lists/AuthorsList'
import { AlbumList } from '../components/Lists/AlbumList'
export const SearchPage = () => {
	const {searchValue, setSearchValue} = useAuth()
	const [resultSongList, setResultSongList] = useState([])
	const [resultAuthorList, setResultAuthorList] = useState([])
	const [resultAlbumList, setResultAlbumList] = useState([])
	const [shadowColor, setShadowColor] = useState("")
	useEffect(() => {
		setResultSongList([])
		setResultAuthorList([])
		setResultAlbumList([])
	}, [searchValue])

	useEffect(() => {
		if(resultSongList.length !== 0){
			setShadowColor(resultSongList[0].imageColors[0] + 'a6')
		}
		else if(resultAuthorList.length !== 0){
			setShadowColor(resultAuthorList[0].imageColors[0] + 'a6')
		}
		else if(resultAlbumList.length !== 0){
			setShadowColor(resultAlbumList[0].imageColors[0] + 'a6')
		}
		else setShadowColor("")
	}, [resultSongList, resultAuthorList, resultAlbumList])
	return (
		<div className="SearchPage" style={{ animation: 'zoomIn .2s forwards' }}>
			<SearchBar
				value={searchValue}
				setValue = {setSearchValue}
				allFoundSongs = {resultSongList}
				setAllFoundSongs = {setResultSongList}
				setResultPlaylists = {setResultAlbumList}
				setResultAuthorList = {setResultAuthorList}
				focus
			/>

			<SongList listOfSongs = {resultSongList} source = {{ source: '/search', name: "Search", image: "https://www.pngkey.com/png/full/87-872187_lupa-search-icon-white-png.png", songsList:resultSongList }} title = {"Songs"} showListens displayIfEmpty = {""}/>
			<AuthorsList listOfAuthors = {resultAuthorList} title = {"Authors"}/>
			<AlbumList listOfAlbums = {resultAlbumList} title = {"Albums and Playlists"} loading = {false}/>
			<div className="colorfullShadow" style={{ background: shadowColor }}></div>
		</div>
	)
}
