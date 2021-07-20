import React, { useState } from 'react'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { FiXCircle } from 'react-icons/fi'
import { firestore, storage } from '../../firebase'
import getUID from '../../functions/other/getUID'
import { PersonTiny } from '../Basic/PersonTiny'
import { RadioBtn } from '../SignIn-Up/RadioBtn'
import { SongItem } from '../FullScreenPlayer/SongItem'
import { LoadingCircle } from '../Loading/LoadingCircle'
import { ColorExtractor } from 'react-color-extractor'
import { useAuth } from '../../contexts/AuthContext'
import { findVariantsOfName } from '../../functions/find/findVariantsOfName'
import { SearchBar } from '../Basic/SearchBar'
import { DownloadPhotoButton } from '../Buttons/DownloadPhotoButton'
import { ErrorPlate } from '../MessagePlates/ErrorPlate'
import { FullScreenLoading } from '../Loading/FullScreenLoading'
export const AddPlaylist = () => {
	const { currentUser } = useAuth()
	const [playlistName, setPlaylistName] = useState("")
	const [playlistCover, setPlaylistCover] = useState("")
	const [authorsInputValue, setAuthorsInputValue] = useState('')
	const [allAuthors, setAllAuthors] = useState([])
	const [chosenAuthors, setChosenAuthors] = useState(!currentUser.isAdmin ? [{ uid: currentUser.uid, photoURL: currentUser.photoURL, displayName: currentUser.displayName }] : [])
	const [releaseDate, setReleaseDate] = useState(currentUser.isAdmin ? "" : new Date().toString())
	const [songsSearch, setSongsSearch] = useState("")
	const [allSongs, setAllSongs] = useState([])
	const [chosenSongs, setChosenSongs] = useState([])
	const [playlistStatus, setPlaylistStatus] = useState(0)
	const [isPlaylistPrivate, setIsPlaylistPrivate] = useState(0)
	const [imageLocalPath, setImageLocalPath] = useState('')
	const [imageColors, setImageColors] = useState([])
	const [errorMessage, setErrorMessage] = useState("")
	const [loadingPlaylist, setLoadingPlaylist] = useState(false)

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

	async function addPlaylistToFirebase(e) {
		e.preventDefault()
		const uid = getUID()
		if (playlistName.length === 0) setErrorMessage("Playlist has to have some name")
		else if (chosenAuthors.length === 0) setErrorMessage('Playlist has to have at least 1 author')
		else if (releaseDate.length === 0) setErrorMessage('You have to set release date for a playlist')
		else {
			setLoadingPlaylist(true)
			firestore.collection('playlists').doc(uid).set(
				{
					id: uid,
					name: playlistName,
					songs: chosenSongs,
					authors: chosenAuthors,
					image: playlistCover,
					listens: 0,
					creationDate: releaseDate,
					subscribers: 0,
					isAlbum: playlistStatus === 1,
					imageColors: imageColors,
					isPrivate: isPlaylistPrivate === true
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
				setLoadingPlaylist(false)
			}).catch(err => {
				setErrorMessage(err)
				setLoadingPlaylist(false)
			})


			chosenAuthors.forEach(async author => {
				const authorRef = await firestore.collection('users').doc(author.uid).get()
				const authorData = authorRef.data()
				const authorPlaylists = authorData.ownPlaylists
				authorPlaylists.push(uid)
				firestore.collection('users').doc(author.uid).update({
					ownPlaylists: authorPlaylists
				})
			})

			firestore.collection('search').doc(uid).set({
				place: 'playlists',
				uid: uid,
				variantsOfName: findVariantsOfName(playlistName)
			})
		}
	}

	return (
		<div className="AddSong">
			<FullScreenLoading loading = {loadingPlaylist}/>
			<ColorExtractor src={imageLocalPath} getColors={(colors) => setImageColors(colors)} />
			<form onSubmit={e => e.preventDefault()}>
				<label>
					<h3>Playlist name</h3>
					<input type="text" placeholder="Enter playlist name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} required />
				</label>
				<label>
					<h3>Playlist authors</h3>
					<SearchBar value={authorsInputValue} setValue={setAuthorsInputValue} setResultAuthorList={setAllAuthors} defaultSearchMode={"authors"} inputText={"Search for authors"} />
					{/* <input type="text" placeholder="Enter author name" value={authorsInputValue} onChange={(e) => setAuthorsInputValue(e.target.value)} style={{ marginBottom: '5px' }} onKeyUp={() => timerUpFunc(findAuthors)} onKeyDown={() => { return clearTimeout(typingTimeout) }} /> */}
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
						{
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
					<SearchBar value={songsSearch} setValue={setSongsSearch} setAllFoundSongs={setAllSongs} defaultSearchMode={'songs'} inputText={"Search for songs"} />
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
						{
							allSongs.map((data, index) => {
								return (
									<SongItem song={data} localIndex={index} listOfChosenSongs={chosenSongs} setListOfSongs={setChosenSongs} />
								)
							})
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


				<DownloadPhotoButton setErrorMessage={setErrorMessage} setImageLocalPath={setImageLocalPath} downloadedPhoto={playlistCover} setDownloadedPhoto={setPlaylistCover} place={'songsImages/'} btnText={"Download playlist cover"} />
				<ErrorPlate errorMessage={errorMessage} />
				<button className="addSongBtn" onClick={addPlaylistToFirebase}>Add playlist</button>
			</form>
		</div>
	)
}
