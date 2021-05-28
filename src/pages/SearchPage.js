import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SongItem } from '../components/FullScreenPlayer/SongItem'
import { authors } from '../data/authors'
import { songs } from '../data/songs'
import { playlists } from '../data/playlists'
import { AiFillFire } from 'react-icons/ai'
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
export const SearchPage = () => {
	const { setCurrentSongQueue, setCurrentSongPlaylistSource } = useSong()
	const [searchValue, setSearchValue] = useState("")
	const [resultSongList, setResultSongList] = useState([])
	const [resultAuthorList, setResultAuthorList] = useState([])
	const [resultUserList, setResultUserList] = useState([])
	const [resultAlbumList, setResultAlbumList] = useState([])
	const [firstSongColors, setFirstSongColors] = useState([])
	const [shadowColor, setShadowColor] = useState("")
	const [showAllSongs, setShowAllSongs] = useState(false)
	const [showAllAuthors, setShowAllAuthors] = useState(false)
	const [showAllUsers, setShowAllUsers] = useState(false)
	const [showAllAlbums, setShowAllAlbums] = useState(false)
	const [loading, setLoading] = useState(true)
	function findTop(list, criterion, setTop, amountOfTopElements = 5) {
		let tempArr = []
		list.forEach((el) => {
			tempArr.push(el)
		})
		tempArr.sort((song1, song2) => song2[criterion] - song1[criterion])
		tempArr.length = amountOfTopElements
		setTop(tempArr)
	}

	// function searchNormalize(str) {
	// 	return str.toLowerCase().replace(/[.-/_$#@*()!+=\s']/g, '')
	// }

	function setQueueInSearch() {
		setCurrentSongQueue(resultSongList)
		setCurrentSongPlaylistSource({ source: '/search', name: "Search", image: "https://lh3.googleusercontent.com/proxy/PJSN5iZPJhIuQKV-efbS0KD_HoL9nu4cyDmwOfWatZdeOyLBsEtosSWHTw4aK9ZKhrTEW2LGZCGxmH9vYFYx_PT16PIrETeNqijSxA", songsList:resultSongList })
	}

	// async function fetchSongs(){
	// 	const response=firestore.collection("songs")
	// 	.orderBy("listens", "desc")
	// 	const data= await response.get();
	// 	data.docs.forEach(item=>{
	// 	 setTestSongList(prev=>[...prev, item.data()])
	// 	})
	// 	setLoading(false)
	// }

	// useEffect(() => {
	// 	fetchSongs()
	// }, [])

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
			/>
			{/* <div className="searchBar">
				<div className="searchBarElement">
					<BackBtn color={testSongList[0]&&testSongList[0].imageColors[0]} />
					<span onClick={() => searchValue.length ? setSearchValue("") : null}>{searchValue.length ? <FiX /> : <FiSearch />}</span>
				</div>
				<input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search for something" />
			</div> */}
			<div className="results" onClick={setQueueInSearch}>
				{resultSongList.map((song, index)=>{
					return (
						<SongItem song = {song} localIndex = {index} showListens = {true} listens = {song.listens}/>
					)
				})}
			</div>
			<div className="authorResult" style={!resultAuthorList.length ? { display: 'none' } : {}}>
					<TitleWithMoreBtn title = "Authors" func = {()=>setShowAllAuthors(!showAllAuthors)} boolVal = {showAllAuthors} lenOfList = {resultAuthorList.length} marginBottom = {10}/>
					{resultAuthorList && resultAuthorList.map((data, index) => {
						if(!showAllAuthors){
							if (index < 5) {
								return (
									<AuthorItemBig data = {data}/>
								)
							}
						}
						else{
							return (
								<AuthorItemBig data = {data}/>
							)
						}
					
					})}
				</div>
				<div className="playlistsResult" style={!resultAlbumList.length ? { display: 'none' } : {}}>
					<TitleWithMoreBtn title = "Albums and Playlists" func = {()=>setShowAllAlbums(!showAllAlbums)} boolVal = {showAllAlbums} lenOfList = {resultAlbumList.length} marginBottom = {15}/>
					<div className="playLists">
						{resultAlbumList && resultAlbumList.map((playlist, index) => {
							if(!showAllAlbums){
								if (index < 5) {
									return (
										<PlaylistItem playlist={playlist} key = {index}/>
									)
								}
							}
							else{
								return (
									<PlaylistItem playlist={playlist} key = {index}/>
								)
							}
						})}
					</div>
				</div>
			{/* <div className="results" >
				<div className="songsResult" style={!resultSongList.length ? { display: 'none' } : {}} onClick={setQueueInSearch}>
					<TitleWithMoreBtn title = {searchValue.length ? "Songs" : <span>Top songs<AiFillFire /></span>} func = {()=>setShowAllSongs(!showAllSongs)} boolVal = {showAllSongs} lenOfList = {resultSongList.length}/>
					{resultSongList.map((song, index) => {
						if(!showAllSongs){
							if (index < 5) {
								return (
									<div key={song.id}>
										<SongItem song = {song} localIndex = {index} showListens={true} listens={song.listens} />
									</div>
								)
							}
						}
						else{
							return (
								<div key={song.id}>
									<SongItem song = {song} localIndex = {index} showListens={true} listens={song.listens} />
								</div>
							)
						}
					})}
				</div>
				
				<div className="authorResult" style={!resultUserList.length ? { display: 'none' } : {}}>
					<TitleWithMoreBtn title = "Users" func = {()=>setShowAllUsers(!showAllUsers)} boolVal = {showAllUsers} lenOfList = {resultUserList.length} marginBottom = {10}/>
					{resultUserList.map(({ name, image }, index) => {
						if(!showAllUsers){
							if (index < 5) {
								return (
									<Link to={`/authors/${normalizeString(name)}`} key = {index}>
										<div className="person">
											<div className="pesronImg">
												<img src={image} alt="" />
											</div>
											<div className="personName">
												{name}
											</div>
										</div>
									</Link>
								)
							}
						}
						else{
							return (
								<Link to={`/authors/${normalizeString(name)}`} key = {index}>
									<div className="person">
										<div className="pesronImg">
											<img src={image} alt="" />
										</div>
										<div className="personName">
											{name}
										</div>
									</div>
								</Link>
							)
						}
						
					})}
				</div>
				<div className="playlistsResult" style={!resultAlbumList.length ? { display: 'none' } : {}}>
					<TitleWithMoreBtn title = "Albums and Playlists" func = {()=>setShowAllAlbums(!showAllAlbums)} boolVal = {showAllAlbums} lenOfList = {resultAlbumList.length} marginBottom = {15}/>
					<div className="playLists">
						{resultAlbumList.map((playlist, index) => {
							if(!showAllAlbums){
								if (index < 5) {
									return (
										<PlaylistItem playlist={playlist} key = {index}/>
									)
								}
							}
							else{
								return (
									<PlaylistItem playlist={playlist} key = {index}/>
								)
							}
						})}
					</div>
				</div>
			</div> */}
			<div className="colorfullShadow" style={{ background: resultSongList[0]&&resultSongList[0].imageColors[0] + "a6" }}></div>

		</div>
	)
}
