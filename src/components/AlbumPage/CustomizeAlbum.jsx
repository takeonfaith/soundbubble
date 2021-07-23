import React, { useEffect, useState } from 'react'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { FiXCircle } from 'react-icons/fi'
import { firestore, storage } from '../../firebase'
import getUID from '../../functions/other/getUID'
import { PersonTiny } from '../Basic/PersonTiny'
import { RadioBtn } from '../SignIn-Up/RadioBtn'
import { LoadingCircle } from '../Loading/LoadingCircle'
import { ColorExtractor } from 'react-color-extractor'
import { useAuth } from '../../contexts/AuthContext'
import { SongList } from '../Lists/SongList'
import { SearchBar } from '../Basic/SearchBar'
export const CustomizeAlbum = ({ playlist }) => {
	const { currentUser } = useAuth()
	const [playlistName, setPlaylistName] = useState(playlist.name)
	const [playlistCover, setPlaylistCover] = useState(playlist.image)
	const [authorsInputValue, setAuthorsInputValue] = useState('')
	const [allAuthors, setAllAuthors] = useState([])
	const [chosenAuthors, setChosenAuthors] = useState(playlist.authors)
	const [releaseDate, setReleaseDate] = useState(playlist.creationDate)
	const [songsSearch, setSongsSearch] = useState("")
	const [allSongs, setAllSongs] = useState([])
	const [chosenSongs, setChosenSongs] = useState(playlist.songs)
	const [playlistStatus, setPlaylistStatus] = useState(playlist.isAlbum?1:0)
	const [isPlaylistPrivate, setIsPlaylistPrivate] = useState(playlist.isPrivate ? 1 : 0)
	const [loadingAuthors, setLoadingAuthors] = useState(false)
	const [loadingSongs, setLoadingSongs] = useState(false)
	const [imageLocalPath, setImageLocalPath] = useState('')
	const [imageColors, setImageColors] = useState(playlist.imageColors)

	useEffect(() => {
		setPlaylistName(playlist.name)
		setPlaylistCover(playlist.image)
		setChosenAuthors(playlist.authors)
	}, [playlist.id])

	useEffect(() => {
		if (songsSearch.length === 0) {
			playlist.songs.map(async songId => {
				const songData = (await firestore.collection('songs').doc(songId).get()).data()
				setLoadingSongs(false)
				setAllSongs(prev => [...prev, songData])
			})
		}
	}, [songsSearch])


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
		if (chosenAuthors.length > playlist.authors.length) {
			const newAuthors = chosenAuthors.filter(author => { return !playlist.authors.find(a => a.uid === author.uid) })
			newAuthors.forEach(async author => {
				const authorRef = await firestore.collection('users').doc(author.uid).get()
				const authorData = authorRef.data()
				const authorPlaylists = authorData.ownPlaylists
				authorPlaylists.push(playlist.id)
				firestore.collection('users').doc(author.uid).update({
					ownPlaylists: authorPlaylists
				})
			})
		}
		else if(chosenAuthors.length < playlist.authors.length){
			const newAuthors = playlist.authors.filter(author => { return !chosenAuthors.find(a => a.uid === author.uid) })
			newAuthors.forEach(async author => {
				const authorRef = await firestore.collection('users').doc(author.uid).get()
				const authorData = authorRef.data()
				const authorPlaylists = authorData.ownPlaylists
				const filteredPlaylists = authorPlaylists.filter(playlistId => playlistId !== playlist.id)
				firestore.collection('users').doc(author.uid).update({
					ownPlaylists: filteredPlaylists
				})
			})
		}

		firestore.collection('playlists').doc(playlist.id).update(
			{
				id: playlist.id,
				name: playlistName,
				songs: chosenSongs,
				authors: chosenAuthors,
				image: playlistCover,
				listens: playlist.listens,
				creationDate: releaseDate, 
				subscribers:playlist.subscribers,
				isAlbum:playlistStatus === 1,
				imageColors:imageColors,
				isPrivate:isPlaylistPrivate === 1
			}
		)
	}

	return (
		<div className="AddSong">
			<ColorExtractor src={imageLocalPath} getColors={(colors) => setImageColors(colors)} />
			<form onSubmit = {e=>e.preventDefault()}>
				<label>
					<h3>Playlist name</h3>
					<input type="text" placeholder="Enter playlist name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} required />
				</label>
				<label>
					<h3>Playlist authors</h3>
					<SearchBar value = {authorsInputValue} setValue = {setAuthorsInputValue} setResultAuthorList = {setAllAuthors} defaultSearchMode = {'authors'} inputText = {"Search for authors"}/>
					<div className="chosenAuthorsList">
						{chosenAuthors.map((author) => {
							return (
								<div className="chosenAuthorItem">
									<span>{author.displayName}</span>
									<FiXCircle onClick={() => author.uid === currentUser.uid ? null : removeAuthorFromList(author)} />
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
					<SearchBar value = {songsSearch} setValue = {setSongsSearch} setAllFoundSongs = {setAllSongs} defaultSearchMode = {'songs'} inputText = {"Search for songs"}/>
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
							</div> :
							<SongList listOfSongs={allSongs} source={'no'} listOfChosenSongs={chosenSongs} setListOfSongs={setChosenSongs} />
						}
					</div>
				</label>

				{
					currentUser.isAdmin || currentUser.isAuthor ? <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '15px 0' }}>
						<RadioBtn label="Playlist" onClick={() => setPlaylistStatus(0)} currentActive={playlistStatus} id={0} />
						<RadioBtn label="Album" onClick={() => setPlaylistStatus(1)} currentActive={playlistStatus} id={1} />
					</div> :
						null
				}

				<div style={{ display: 'flex', justifyContent: 'flex-start', margin: '15px 0' }}>
					<RadioBtn label="Not Private" onClick={() => setIsPlaylistPrivate(0)} currentActive={isPlaylistPrivate} id={0} />
					<RadioBtn label="Private" onClick={() => setIsPlaylistPrivate(1)} currentActive={isPlaylistPrivate} id={1} />
				</div>

				{
					currentUser.isAdmin || currentUser.isAuthor ?
						<label>
							<h3>Release Date</h3>
							<input type="date" name="" id="" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
						</label> : null
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
				<button type="button" className="addSongBtn" onClick={addPlaylistToFirebase}>Update playlist</button>
			</form>
		</div>
	)
}
