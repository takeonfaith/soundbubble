import React, { useState } from 'react'
import { FiSearch, FiX} from 'react-icons/fi'
import { firestore } from '../../firebase'
import { BackBtn } from './BackBtn'
import { LoadingCircle } from './LoadingCircle'

export const SearchBar = ({value, setValue, allFoundSongs, setAllFoundSongs, setResultPlaylists, setResultAuthorList}) => {
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")
	const whereToSeek = [
		{
			place:'songs',
			seekField:'name',
			setResult:setAllFoundSongs
		}, 
		{
			place:'users',
			seekField:'displayName',
			setResult:setResultAuthorList
		}, 
		{
			place:'playlists',
			seekField:'name',
			setResult:setResultPlaylists
		}
	]
	let typingTimeout

	async function findSongs(){
		const foundItemTempArray = []
		const response = firestore.collection('songs')
			.where('name', "==", value)
		const data = await response.get();
		data.docs.forEach(item => {
			foundItemTempArray.push(item.data())
		})
		setAllFoundSongs(foundItemTempArray)
		setLoading(false)
	}

	async function findAuthors(){
		const foundItemTempArray = []
		const response = firestore.collection('users')
			.where('displayName', "==", value)
		const data = await response.get();
		data.docs.forEach(item => {
			foundItemTempArray.push(item.data())
		})
		console.log(foundItemTempArray)
		setResultAuthorList(foundItemTempArray)
		setLoading(false)
	}

	async function findPlaylists(){
		const foundItemTempArray = []
		const response = firestore.collection('playlists')
			.where('name', "==", value).where('isPrivate', '==', 'false')
		const data = await response.get();
		data.docs.forEach(item => {
			foundItemTempArray.push(item.data())
		})
		setResultPlaylists(foundItemTempArray)
		setLoading(false)
	}

	function findSomething() {
		setLoading(true)
		findSongs()
		findAuthors()
		findPlaylists()
	}

	function timerUpFunc(func) {
		clearTimeout(typingTimeout)
		setTimeout(func, 1000)
	}
	
	return (
		<div> 
			<div className="searchBar">
				<div className="searchBarElement">
					<BackBtn />
					<span onClick={() => value.length ? setValue("") : null}>{value.length ? <FiX /> : <FiSearch />}</span>
				</div>
				<input type="text" placeholder="Search for songs or for people" value={value} onChange={(e) => setValue(e.target.value)} onKeyUp={() => timerUpFunc(findSomething)} onKeyDown={() => {clearTimeout(typingTimeout)} } />
			</div>
			<div className="authorsResult">
				{loading ?
					<div style={{ position: 'relative', width: '100%', height: '50px', marginTop:'40px' }}>
						<LoadingCircle />
					</div> :
					<h2>{message}</h2>}
			</div>
		</div>
	)
}
