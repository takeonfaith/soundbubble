import React, { useEffect, useState } from 'react'

import "../styles/SearchPage.css"
import { PlaylistItem } from '../components/AuthorPage/PlaylistItem'
import { useSong } from '../functionality/SongPlay/SongContext'
import { BackBtn } from '../components/Basic/BackBtn'
import { FiSearch, FiX } from 'react-icons/fi'
import { TitleWithMoreBtn } from '../components/Basic/TitleWithMoreBtn'
import { firestore } from '../firebase'
import { LoadingCircle } from '../components/Basic/LoadingCircle'
import { SearchBar } from '../components/Basic/SearchBar'
import {AuthorItemBig} from '../components/AuthorPage/AuthorItemBig'
import { useAuth } from '../functionality/AuthContext'
import { SongList } from '../components/Basic/SongList'
import { AuthorsList } from '../components/Basic/AuthorsList'
import { AlbumList } from '../components/Basic/AlbumList'
export const SearchPage = () => {
	const [searchValue, setSearchValue] = useState("")
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

			<SongList listOfSongs = {resultSongList} source = {{ source: '/search', name: "Search", image: "https://lh3.googleusercontent.com/proxy/PJSN5iZPJhIuQKV-efbS0KD_HoL9nu4cyDmwOfWatZdeOyLBsEtosSWHTw4aK9ZKhrTEW2LGZCGxmH9vYFYx_PT16PIrETeNqijSxA", songsList:resultSongList }} title = {"Songs"} showListens/>
			<AuthorsList listOfAuthors = {resultAuthorList} title = {"Authors"}/>
			<AlbumList listOfAlbums = {resultAlbumList} title = {"Albums and Playlists"} loading = {false}/>
			<div className="colorfullShadow" style={{ background: shadowColor }}></div>
		</div>
	)
}
