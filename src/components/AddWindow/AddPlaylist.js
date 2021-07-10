import React, { useState } from 'react'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { FiXCircle } from 'react-icons/fi'
import { firestore, storage } from '../../firebase'
import getUID from '../../functions/getUID'
import { PersonTiny } from '../Basic/PersonTiny'
import { RadioBtn } from '../SignIn-Up/RadioBtn'
import { SongItemChoice } from '../Basic/SongItemChoice'
import { LoadingCircle } from '../Basic/LoadingCircle'
import { ColorExtractor } from 'react-color-extractor'
import { useAuth } from '../../contexts/AuthContext'
import { findVariantsOfName } from '../../functions/findVariantsOfName'
export const AddPlaylist = () => {
	const {currentUser} = useAuth()
	const [playlistName, setPlaylistName] = useState("")
	const [playlistCover, setPlaylistCover] = useState("")
	const [authorsInputValue, setAuthorsInputValue] = useState('')
	const [allAuthors, setAllAuthors] = useState([])
	const [chosenAuthors, setChosenAuthors] = useState(!currentUser.isAdmin?[{uid:currentUser.uid, photoURL:currentUser.photoURL, displayName:currentUser.displayName}]:[])
	const [releaseDate, setReleaseDate] = useState(currentUser.isAdmin?"":new Date().toString())
	const [songsSearch, setSongsSearch] = useState("")
	const [allSongs, setAllSongs] = useState([])
	const [chosenSongs, setChosenSongs] = useState([])
	const [playlistStatus, setPlaylistStatus] = useState(0)
	const [isPlaylistPrivate, setIsPlaylistPrivate] = useState(0)
	const [loadingAuthors, setLoadingAuthors] = useState(false)
	const [loadingSongs, setLoadingSongs] = useState(false)
	const [imageLocalPath, setImageLocalPath] = useState('')
	const [imageColors, setImageColors] = useState([])
	let typingTimeout
	async function findAuthors(e) {
		
		setLoadingAuthors(true)
		setAllAuthors([])
		const friendsIds = currentUser.friends.map(friend=>{if(friend.status === 'added') return friend.uid})
		const response = currentUser.isAdmin?
			firestore.collection("users").where("displayName", "==", authorsInputValue):
			firestore.collection("users").where("uid", "in", friendsIds).where("displayName", "==", authorsInputValue)
		const data = await response.get();
		if (data !== undefined) {
			data.docs.forEach(item => {
				setAllAuthors([...allAuthors, item.data()])
			})
			setLoadingAuthors(false)
		}
	}

	async function findSongs(e) {
		setLoadingSongs(true)
		setAllSongs([])
		const response = firestore.collection("songs")
			.where("name", "==", songsSearch)
		const data = await response.get();
		data.docs.forEach(item => {
			setAllSongs([...allAuthors, item.data()])
		})
		setLoadingSongs(false)
	}

	function removeAuthorFromList(data) {
		const filtered = chosenAuthors.filter(people => people.uid !== data.uid)
		return setChosenAuthors(filtered)
	}


	function removeSongFromList(data) {
		const filtered = chosenSongs.filter(song => song !== data)
		return setChosenSongs(filtered)
	}

	function addAuthor(data) {
		if (!chosenAuthors.some(person => person.uid === data.uid)) {
			return setChosenAuthors(prev => [...prev, {
				uid: data.uid,
				displayName: data.displayName,
				photoURL: data.photoURL
			}])
		}

		removeAuthorFromList(data)
	}

	async function onFileChange(e, place, setFunc) {
		const file = e.target.files[0]
		setImageLocalPath(URL.createObjectURL(file))
		const storageRef = storage.ref()
		const fileRef = storageRef.child(place + file.name)
		await fileRef.put(file)
		setFunc(await fileRef.getDownloadURL())
	}

	async function addPlaylistToFirebase(e) {
		e.preventDefault()
		const uid = getUID()
		firestore.collection('playlists').doc(uid).set(
			{
				id: uid,
				name: playlistName,
				songs: chosenSongs,
				authors: chosenAuthors,
				image: playlistCover,
				listens: 0,
				creationDate: releaseDate, 
				subscribers:0,
				isAlbum:playlistStatus,
				imageColors:imageColors,
				isPrivate:isPlaylistPrivate === true
			}
		).then(() => {
			setAllAuthors([])
			setAuthorsInputValue("")
			setChosenAuthors([])
			setPlaylistCover('')
			setPlaylistName('')
			setReleaseDate('')
			setSongsSearch('')
			setChosenSongs([])
			setIsPlaylistPrivate(0)
		}).catch(err => {
			console.log(err)
		})


		chosenAuthors.forEach(async author=>{
			const authorRef = await firestore.collection('users').doc(author.uid).get()
			const authorData = authorRef.data()
			const authorPlaylists = authorData.ownPlaylists
			authorPlaylists.push(uid)
			firestore.collection('users').doc(author.uid).update({
				ownPlaylists:authorPlaylists
			})
		})

		firestore.collection('search').doc(uid).set({
			place:'playlists',
			uid:uid,
			variantsOfName:findVariantsOfName(playlistName)
		})
	}

	function timerUpFunc(func) {
		clearTimeout(typingTimeout)
		typingTimeout = setTimeout(func, 1000)
	}

	return (
		<div className="AddSong">
			<ColorExtractor src = {imageLocalPath} getColors = {(colors)=>setImageColors(colors)}/>
			<form onSubmit={addPlaylistToFirebase}>
				<label>
					<h3>Playlist name</h3>
					<input type="text" placeholder="Enter playlist name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} required />
				</label>
				<label>
					<h3>Playlist authors</h3>
					<input type="text" placeholder="Enter author name" value={authorsInputValue} onChange={(e) => setAuthorsInputValue(e.target.value)} style={{ marginBottom: '5px' }} onKeyUp={()=>timerUpFunc(findAuthors)} onKeyDown={() => { return clearTimeout(typingTimeout) }} />
					<div className="chosenAuthorsList">
						{chosenAuthors.map((author) => {
							return (
								<div className="chosenAuthorItem">
									<span>{author.displayName}</span>
									<FiXCircle onClick={() => author.uid === currentUser.uid?null:removeAuthorFromList(author)} />
								</div>
							)
						})}
					</div>
					<div className="authorsResult">
						{loadingAuthors ?
							<div style={{ position: 'relative', width: '100%', height: '50px' }}>
								<LoadingCircle />
							</div>
							:
							allAuthors.map((data, index) => {
								return (
									<PersonTiny data={data} onClick={() => addAuthor(data)} style={chosenAuthors.includes(data.uid) ? { background: 'var(--green)' } : {}} key={index} />
								)
							})
						}
					</div>
				</label>

				<label>
					<h3>Search for songs</h3>
					<input type="text" placeholder="Search for songs" value={songsSearch} onChange={(e) => setSongsSearch(e.target.value)} onKeyDown={findSongs} onKeyUp={() => timerUpFunc(findSongs)} onKeyDown={() => { return clearTimeout(typingTimeout) }} style={{ marginBottom: '5px' }} />
					<div className="chosenAuthorsList">
						{chosenSongs.map((songId) => {
							return (
								<div className="chosenAuthorItem">
									<span>{songId}</span>
									<FiXCircle onClick={() => removeSongFromList(songId)} />
								</div>
							)
						})}
					</div>
					<div className="authorsResult">
						{loadingSongs ?
							<div style={{ position: 'relative', width: '100%', height: '50px' }}>
								<LoadingCircle />
							</div>:
							allSongs.map((data, index) => {
							return (
								<SongItemChoice song={data} listOfSongs={chosenSongs} setListOfSongs={setChosenSongs} />
							)
						})}
					</div>
				</label>

				{
					currentUser.isAdmin || currentUser.isAuthor? <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '15px 0' }}>
						<RadioBtn label="Playlist" onClick={() => setPlaylistStatus(0)} currentActive={playlistStatus} id={0} />
						<RadioBtn label="Album" onClick={() => setPlaylistStatus(1)} currentActive={playlistStatus} id={1} />
					</div>:
					null
				}

				<div style={{ display: 'flex', justifyContent: 'flex-start', margin: '15px 0' }}>
					<RadioBtn label="Not Private" onClick={() => setIsPlaylistPrivate(0)} currentActive={isPlaylistPrivate} id={0} />
					<RadioBtn label="Private" onClick={() => setIsPlaylistPrivate(1)} currentActive={isPlaylistPrivate} id={1} />
				</div>

				{
					currentUser.isAdmin || currentUser.isAuthor?
					<label>
						<h3>Release Date</h3>
						<input type="date" name="" id="" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
					</label>:null
				}

				<label className="downloadFile">
					<div className="downloadPhoto">
						<span className="downloadBtnText">
							<AiOutlineCloudDownload />
							Download playlist cover
						</span>
						<span className="photoLoadLine" style={playlistCover !== '' ? { width: '100%' } : {}}></span>
					</div>
					<input type="file" name="" id="" onChange={(e) => onFileChange(e, 'songsImages/', setPlaylistCover)} />
				</label>
				<button type="submit" className="addSongBtn">Add playlist</button>
			</form>
		</div>
	)
}
