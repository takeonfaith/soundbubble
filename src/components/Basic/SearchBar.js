import React, { useEffect, useRef, useState } from 'react'
import { FiSearch, FiX} from 'react-icons/fi'
import { firestore } from '../../firebase'
import { BackBtn } from './BackBtn'
import { LoadingCircle } from './LoadingCircle'

export const SearchBar = ({value, setValue, setAllFoundSongs, setResultPlaylists, setResultAuthorList, focus = false, defaultSearchMode = undefined, inputText = "Search for songs or for people",defaultSongsListValue}) => {
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")
	const [foundAnything, setFoundAnything] = useState(false)
	const [searchMode, setSearchMode] = useState(0)
	const inputRef = useRef(null)
	let typingTimeout

	async function findSongs(){
		const foundItemTempArray = []
		let response = firestore.collection('songs')
			.where('name', "==", value)
		const data = await response.get();
		data.docs.forEach(item => {
			if(defaultSongsListValue && defaultSongsListValue.length){
				if(defaultSongsListValue.map(song=>song.id).includes(item.id)) foundItemTempArray.push(item.data())
			}
			else foundItemTempArray.push(item.data())
		})

		if(foundItemTempArray.length !== 0 && searchMode === 0 && defaultSearchMode === undefined) {
			foundItemTempArray.forEach(async song=>{
				const authorsIdsArray = (await firestore.collection('songs').doc(song.id).get()).data().authors
				authorsIdsArray.forEach(async (author, index)=>{
					if(index < 3){
						const authorData = (await firestore.collection('users').doc(author.uid).get()).data()
						setResultAuthorList(prev=>[...prev, authorData])
					}
				})
			})
		}
		setAllFoundSongs(foundItemTempArray)
		setLoading(false)
		if(foundItemTempArray.length !== 0)setFoundAnything(true)
	}

	async function findAuthors(){
		const foundItemTempArray = []
		const response = firestore.collection('users')
			.where('displayName', "==", value)
		const data = await response.get();
		data.docs.forEach(item => {
			foundItemTempArray.push(item.data())
		})
		if(defaultSearchMode === undefined && foundItemTempArray.length !== 0 && searchMode === 0) {
			
			foundItemTempArray.forEach(async author=>{
				const songsIdsArray = (await firestore.collection('users').doc(author.uid).get()).data().ownSongs
				const albumsIdsArray = (await firestore.collection('users').doc(author.uid).get()).data().ownPlaylists
				songsIdsArray.forEach(async (songId, index)=>{
					if(index < 3){
						const songData = (await firestore.collection('songs').doc(songId).get()).data()
						setAllFoundSongs(prev=>[...prev, songData])
					}
				})

				albumsIdsArray.forEach(async (albumId, index)=>{
					if(index < 3){
						const albumData = (await firestore.collection('playlists').doc(albumId).get()).data()
						setResultPlaylists(prev=>[...prev, albumData])
					}
				})
			})
		}
		setResultAuthorList(foundItemTempArray)
		setLoading(false)
		if(foundItemTempArray.length !== 0)setFoundAnything(true)
	}

	async function findPlaylists(){
		const foundItemTempArray = []
		const response = firestore.collection('playlists')
			.where('name', "==", value).where('isPrivate', '==', false)
		const data = await response.get();
		data.docs.forEach(item => {
			foundItemTempArray.push(item.data())
		})
		if(foundItemTempArray.length !== 0 && searchMode === 0) {
			
			foundItemTempArray.forEach(async playlist=>{
				const songsIdsArray = (await firestore.collection('playlists').doc(playlist.id).get()).data().authors
				songsIdsArray.forEach(async (author, index)=>{
					if(index < 3){
						const songData = (await firestore.collection('users').doc(author.uid).get()).data()
						setResultAuthorList(prev=>[...prev, songData])
					}
				})
			})
		}
		setResultPlaylists(foundItemTempArray)
		setLoading(false)
		if(foundItemTempArray.length !== 0)setFoundAnything(true)
	}

	function findSomething() {
		setLoading(true)
		setFoundAnything(false)
		if(value !== ""){

			if(defaultSearchMode === undefined){
				if(searchMode === 0 || searchMode === 1) {
					findSongs()
					setResultAuthorList([])
					setResultPlaylists([])
				}
				if(searchMode === 0 || searchMode === 2) 
				{
					findAuthors()
					setAllFoundSongs([])
					setResultPlaylists([])
				}
				if(searchMode === 0 || searchMode === 3) 
				{
					findPlaylists()
					setResultAuthorList([])
					setAllFoundSongs([])
				}
			}
			else{
				switch(defaultSearchMode){
					case "songs":
						findSongs()
						break;
					case "playlists":
						findPlaylists()
						break;
					case "authors":
						findAuthors()
						break;
					default:
						findSongs()
						break;
				}
			}
		}
		else {
			if(defaultSongsListValue !== undefined) setAllFoundSongs(defaultSongsListValue)
			setLoading(false)
		}
		setMessage('Not found')
	}

	function timerUpFunc(func) {
		clearTimeout(typingTimeout)
		typingTimeout = setTimeout(func, 1000)
	}

	useEffect(() => {
		if(focus) inputRef.current.focus()
	}, [])

	useEffect(() => {
		findSomething()
	}, [searchMode])

	
	return (
		<div> 
			<div className="searchBar">
				<div className="searchBarElement">
					<BackBtn />
					<span onClick={() => value.length ? setValue("") : null}>{value.length ? <FiX /> : <FiSearch />}</span>
				</div>
				<input 
					type="text" 
					placeholder={inputText} 
					value={value} 
					onChange={(e) => setValue(e.target.value)} 
					onKeyUp={() => timerUpFunc(findSomething)} 
					onKeyDown={() => {clearTimeout(typingTimeout)} } 
					ref = {inputRef}
				/>
				<div className="searchFilters" style = {defaultSearchMode !== undefined?{display:'none'}:{}}>
					<button onClick = {()=>setSearchMode(0)} style = {searchMode === 0?{background:'var(--lightBlue)'}:{}}>All</button>
					<button onClick = {()=>setSearchMode(1)} style = {searchMode === 1?{background:'var(--lightBlue)'}:{}}>Songs</button>
					<button onClick = {()=>setSearchMode(2)} style = {searchMode === 2?{background:'var(--lightBlue)'}:{}}>Authors</button>
					<button onClick = {()=>setSearchMode(3)} style = {searchMode === 3?{background:'var(--lightBlue)'}:{}}>Playlists</button>
				</div>
			</div>
			<div className="authorsResult">
				{loading ?
					<div style={{ position: 'relative', width: '100%', height: '50px', marginTop:'40px' }}>
						<LoadingCircle />
					</div> :
					!foundAnything && value.length !== 0?<h2>{message}</h2>:null}
			</div>
		</div>
	)
}
