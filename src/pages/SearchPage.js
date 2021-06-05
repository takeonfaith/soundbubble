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

	useEffect(() => {
		setResultSongList([])
	}, [searchValue])
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
				{/* <div className="playlistsResult" style={!resultAlbumList.length ? { display: 'none' } : {}}>
					<div className="playLists">
						{resultAlbumList && resultAlbumList.map((playlist, index) => {
							return (
								<PlaylistItem playlist={playlist} key = {index}/>
							)
						})}
					</div>
				</div> */}
			<div className="colorfullShadow" style={{ background: resultSongList[0]&&resultSongList[0].imageColors[0] + "a6" }}></div>

		</div>
	)
}
