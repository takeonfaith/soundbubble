import React, { useEffect, useState } from 'react'
import { ColorExtractor } from 'react-color-extractor'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { FiXCircle } from 'react-icons/fi'
import { firestore, storage } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { findVariantsOfName } from '../../functions/find/findVariantsOfName'
import getUID from '../../functions/other/getUID'
import { DownloadPhotoButton } from '../Buttons/DownloadPhotoButton'
import { ErrorPlate } from '../MessagePlates/ErrorPlate'
import { LoadingCircle } from '../Loading/LoadingCircle'
import { PersonTiny } from '../Basic/PersonTiny'
import { FullScreenLoading } from '../Loading/FullScreenLoading'
import { SearchBar } from '../Basic/SearchBar'
import { transformLyricsToArrayOfObjects } from '../../functions/other/transformLyricsToArrayOfObject'
export const AddSong = () => {
	const { currentUser } = useAuth()
	const [songName, setSongName] = useState("")
	const [songCover, setSongCover] = useState("")
	const [songSrc, setSongSrc] = useState("")
	const [authorsInputValue, setAuthorsInputValue] = useState('')
	const [allAuthors, setAllAuthors] = useState([])
	const [chosenAuthors, setChosenAuthors] = useState(!currentUser.isAdmin ? [{ uid: currentUser.uid, photoURL: currentUser.photoURL, displayName: currentUser.displayName }] : [])
	const [releaseDate, setReleaseDate] = useState("")
	const [lyrics, setLyrics] = useState("")
	const [imageLocalPath, setImageLocalPath] = useState("")
	const [imageColors, setImageColors] = useState([])
	const [loadingAuthors, setLoadingAuthors] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [showSuccessMessage, setShowSuccessMessage] = useState(false)
	const [loadingSong, setLoadingSong] = useState(false)

	function removeAuthorFromList(data) {
		const filtered = chosenAuthors.filter(people => people.uid !== data.uid)
		return setChosenAuthors(filtered)
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
		setErrorMessage("")
		const file = e.target.files[0]
		let isValid = false
		if (place === 'songsImages/') {
			const validExtensions = [".jpg", ".png", ".jpeg"]
			if (validExtensions.find((ext) => file.name.substr(file.name.length - ext.length, ext.length) === ext)) isValid = true
			else setErrorMessage(`Format of your file is not valid. Download file with one of these: ${validExtensions.map(ex => " " + ex)}`)
		}
		else if (place === "songs/") {
			const validExtensions = [".mp3", ".mp4a", ".flac", ".wav", '.wma']
			if (validExtensions.find((ext) => file.name.substr(file.name.length - ext.length, ext.length) === ext)) isValid = true
			else setErrorMessage(`Format of your file is not valid. Download file with one of these: ${validExtensions.map(ex => ex)}`)
		}

		if (isValid) {
			setImageLocalPath(URL.createObjectURL(file))
			const storageRef = storage.ref()
			const fileRef = storageRef.child(place + file.name)
			await fileRef.put(file)
			setFunc(await fileRef.getDownloadURL())
		}
	}

	async function addSongToFirebase(e) {
		e.preventDefault()

		let uid = getUID()
		setErrorMessage("")
		if (songName.length === 0) setErrorMessage("Song has to have some name")
		else if (chosenAuthors.length === 0) setErrorMessage('Song has to have at least 1 author')
		else if (songCover.length === 0) setErrorMessage('You didn\'t load song cover')
		else if (songSrc.length === 0) setErrorMessage('You didn\'t load song file')
		else if (releaseDate.length === 0) setErrorMessage('You have to set release date for a song')
		else {
			setLoadingSong(true)
			firestore.collection('songs').doc(uid).set(
				{
					id: uid,
					name: songName,
					songSrc: songSrc,
					authors: chosenAuthors,
					cover: songCover,
					listens: 0,
					releaseDate: releaseDate,
					lyrics: transformLyricsToArrayOfObjects(lyrics),
					imageColors: imageColors
				}
			).then(() => {
				setAllAuthors([])
				setAuthorsInputValue("")
				setChosenAuthors([])
				setLyrics([])
				setSongCover('')
				setSongName('')
				setSongSrc('')
				setReleaseDate('')
				setLyrics([])
				setShowSuccessMessage(true)
				setImageColors([])
				setLoadingSong(false)
			}).catch(err => {
				setErrorMessage(err)
				setLoadingSong(false)
			})

			chosenAuthors.forEach(async author => {
				const authorRef = await firestore.collection('users').doc(author.uid).get()
				const authorData = authorRef.data()
				const authorSongs = authorData.ownSongs
				authorSongs.push(uid)
				firestore.collection('users').doc(author.uid).update({
					ownSongs: authorSongs
				})
			})

			firestore.collection('search').doc(uid).set({
				place: 'songs',
				uid: uid,
				variantsOfName: findVariantsOfName(songName)
			})

		}

	}

	useEffect(() => {
		if (showSuccessMessage) {
			setTimeout(() => {
				setShowSuccessMessage(false)
			}, 2000)
		}
	}, [showSuccessMessage])

	function manuallyChangeColor(e, i) {
		imageColors[i] = e.target.value
		setImageColors([...imageColors])
	}

	return (
		<div className="AddSong">
			<FullScreenLoading loading={loadingSong} />
			<ColorExtractor src={imageLocalPath} getColors={(colors) => setImageColors(colors)} />
			<form onSubmit={e => e.preventDefault()}>
				<label>
					<h3>Song name</h3>
					<input type="text" placeholder="Enter song name" value={songName} onChange={(e) => setSongName(e.target.value)} />
				</label>
				<label>
					<h3>Song authors</h3>
					<SearchBar value={authorsInputValue} setValue={setAuthorsInputValue} setResultAuthorList={setAllAuthors} defaultSearchMode={'authors'} inputText = {"Search for authors"}/>
					<div className="chosenAuthorsList">
						{chosenAuthors.map((author) => {
							return (
								<div className="chosenAuthorItem">
									<span>{author.displayName}</span>
									<FiXCircle onClick={() => { if (currentUser.isAdmin) removeAuthorFromList(author); else if (author.uid !== currentUser.uid) removeAuthorFromList(author); }} />
								</div>
							)
						})}
					</div>
					<div className="authorsResult">
						{allAuthors.map((data, index) => {
							return (
								<PersonTiny data={data} onClick={() => addAuthor(data)} style={chosenAuthors.includes(data.uid) ? { background: 'var(--green)' } : {}} key={index} />
							)
						})
						}
					</div>
				</label>

				<label>
					<h3>Release Date</h3>
					<input type="date" name="" id="" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
				</label>

				<ErrorPlate errorMessage={errorMessage} />

				<div style={{ width: '100%', display: 'flex' }}>
					{imageColors.map((color, index) => {
						return <input type="color" value={color} style={{ width: '100%', height: '60px', padding: '0', borderRadius: '0px' }} onChange={(e) => { manuallyChangeColor(e, index) }} />
					})}
				</div>

				<DownloadPhotoButton setErrorMessage={setErrorMessage} setImageLocalPath={setImageLocalPath} downloadedPhoto={songCover} setDownloadedPhoto={setSongCover} place={'songsImages/'} />

				<label className="downloadFile">
					<div className="downloadPhoto">
						<span className="downloadBtnText">
							<AiOutlineCloudDownload />
							Download song file
						</span>
						<span className="photoLoadLine" style={songSrc !== '' ? { width: '100%' } : {}}></span>
					</div>
					<input type="file" name="" id="" onChange={(e) => onFileChange(e, 'songs/', setSongSrc)} />
				</label>

				<label>
					<textarea name="" id="" placeholder={"Add song lyrics"} value={lyrics} onChange={(e) => setLyrics(e.target.value)}></textarea>
				</label>
				<button className="addSongBtn" onClick={addSongToFirebase}>{!showSuccessMessage ? "Add song" : "Song Successfully added. Congrats!"}</button>
			</form>
		</div>
	)
}
