import React, { useEffect, useRef, useState } from 'react'
import { FiSearch, FiXCircle } from 'react-icons/fi'
import { firestore } from '../../firebase'
import { LoadingCircle } from '../Loading/LoadingCircle'
import normalizeString  from '../../functions/other/normalizeString'
export const SearchBar = ({ value, setValue, setAllFoundSongs, setResultPlaylists, setResultAuthorList, focus = false, defaultSearchMode = undefined, inputText = "Search for songs or for people", defaultSongsListValue, defaultAuthorsListValue, defaultPlaylistsListValue }) => {
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")
	const [foundAnything, setFoundAnything] = useState(false)
	const [searchMode, setSearchMode] = useState(0)
	const inputRef = useRef(null)
	let typingTimeout

	async function findItem(place, defaultList = [], setList) {
		const foundItemTempArray = []
		let normalizedSearch = normalizeString(value);
		const itemsList = await firestore.collection('search').where('variantsOfName', "array-contains", normalizedSearch).get();
		itemsList.docs.forEach(async item => {
			const itemData = item.data()
			if (itemData.place === place) {
				const realData = (await firestore.collection(itemData.place).doc(itemData.uid).get()).data()
				if(defaultList !== undefined && defaultList.length){
					if(defaultList.map(song=>song.id || song.uid).includes(itemData.uid)) foundItemTempArray.push(realData)
				}
				else if(!realData.isPrivate) foundItemTempArray.push(realData)
				if (defaultSearchMode === undefined && searchMode === 0 && foundItemTempArray.length !== 0) {
					switch(itemData.place){
						case "songs":
							foundItemTempArray.forEach(async song => {
								const authorsIdsArray = (await firestore.collection('songs').doc(song.id).get()).data().authors
								authorsIdsArray.forEach(async (author, index) => {
									if (index < 3) {
										const authorData = (await firestore.collection('users').doc(author.uid).get()).data()
										setResultAuthorList(prev => {if(!prev.find(el=>el.uid === author.uid)) return [...prev, authorData];else return prev})
									}
								})
							})
							break;
						case "users":
							foundItemTempArray.forEach(async author => {
								const songsIdsArray = (await firestore.collection('users').doc(author.uid).get()).data().ownSongs
								const albumsIdsArray = (await firestore.collection('users').doc(author.uid).get()).data().ownPlaylists
								songsIdsArray.forEach(async (songId, index) => {
									if (index < 3) {
										const songData = (await firestore.collection('songs').doc(songId).get()).data()
										setAllFoundSongs(prev => {if(!prev.find(el=>el.id === songId)) return[...prev, songData];else return prev})
									}
								})
		
								albumsIdsArray.forEach(async (albumId, index) => {
									if (index < 3) {
										const albumData = (await firestore.collection('playlists').doc(albumId).get()).data()
										setResultPlaylists(prev => {if(!prev.find(el=>el.id === albumId)) return[...prev, albumData];else return prev})
									}
								})
							})
							break;
						case "playlists":
							foundItemTempArray.forEach(async playlist => {
								const songsIdsArray = (await firestore.collection('playlists').doc(playlist.id).get()).data().authors
								songsIdsArray.forEach(async (author, index) => {
									if (index < 3) {
										const authorData = (await firestore.collection('users').doc(author.uid).get()).data()
										setResultAuthorList(prev => {if(!prev.find(el=>el.uid === author.uid)) return [...prev, authorData];else return prev})
									}
								})
							})
							break
						default:
							setMessage('Wrong search mode')
							break;
					}
				}
				
				setList(foundItemTempArray)
				setLoading(false)
				if (foundItemTempArray.length !== 0) setFoundAnything(true)
			}
		})
		setLoading(false)
		if(foundItemTempArray.length === 0) {setList([])}
	}

	function findSomething() {
		setLoading(true)
		setFoundAnything(false)
		if (value !== "") {

			if (defaultSearchMode === undefined) {
				if (searchMode === 0 || searchMode === 1) {
					findItem('songs', defaultSongsListValue, setAllFoundSongs)
					setResultAuthorList([])
					setResultPlaylists([])
				}
				if (searchMode === 0 || searchMode === 2) {
					findItem('users', defaultAuthorsListValue, setResultAuthorList)
					setAllFoundSongs([])
					setResultPlaylists([])
				}
				if (searchMode === 0 || searchMode === 3) {
					findItem('playlists', defaultPlaylistsListValue, setResultPlaylists)
					setResultAuthorList([])
					setAllFoundSongs([])
				}
			}
			else {
				switch (defaultSearchMode) {
					case "songs":
						findItem('songs', defaultSongsListValue, setAllFoundSongs)
						break;
					case "playlists":
						findItem('playlists', defaultPlaylistsListValue, setResultPlaylists)
						break;
					case "authors":
						findItem('users', defaultAuthorsListValue, setResultAuthorList)
						break;
					default:
						findItem('songs', defaultSongsListValue, setAllFoundSongs)
						break;
				}
			}
		}
		else {
			if (defaultSongsListValue !== undefined) setAllFoundSongs(defaultSongsListValue)
			if (defaultAuthorsListValue !== undefined) setResultAuthorList(defaultAuthorsListValue)
			if (defaultPlaylistsListValue !== undefined) setResultPlaylists(defaultPlaylistsListValue)
			setLoading(false)
		}
		setMessage('Not found')
	}

	function timerUpFunc(func) {
		clearTimeout(typingTimeout)
		typingTimeout = setTimeout(func, 1000)
	}

	useEffect(() => {
		if (focus) inputRef.current.focus()
	}, [])

	useEffect(() => {
		findSomething()
	}, [searchMode])


	return (
		<div style = {{marginTop:'10px', width:'100%'}}>
			<div className="searchBar">
				<div className="searchBarElement">
					<FiSearch />
					<span onClick={() => value.length ? setValue("") : null}>{value.length ? <FiXCircle /> : null}</span>
				</div>
				<input
					type="text"
					placeholder={inputText}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyUp={() => timerUpFunc(findSomething)}
					onKeyDown={() => { clearTimeout(typingTimeout) }}
					ref={inputRef}
				/>
				<div className="searchFilters" style={defaultSearchMode !== undefined ? { display: 'none' } : {}}>
					<button onClick={() => setSearchMode(0)} style={searchMode === 0 ? { background: 'var(--lightBlue)' } : {}}>All</button>
					<button onClick={() => setSearchMode(1)} style={searchMode === 1 ? { background: 'var(--lightBlue)' } : {}}>Songs</button>
					<button onClick={() => setSearchMode(2)} style={searchMode === 2 ? { background: 'var(--lightBlue)' } : {}}>Authors</button>
					<button onClick={() => setSearchMode(3)} style={searchMode === 3 ? { background: 'var(--lightBlue)' } : {}}>Playlists</button>
				</div>
			</div>
			<div className="authorsResult">
				{loading ?
					<div style={{ position: 'relative', width: '100%', height: '50px', marginTop: '40px' }}>
						<LoadingCircle />
					</div> :
					!foundAnything && value.length !== 0 ? <h2>{message}</h2> : null}
			</div>
		</div>
	)
}
