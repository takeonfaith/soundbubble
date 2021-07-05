import React, { useEffect, useState } from 'react'
import { ColorExtractor } from 'react-color-extractor'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { FiXCircle } from 'react-icons/fi'
import { firestore, storage } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import getUID from '../../functions/getUID'
import { DownloadPhotoButton } from '../Basic/DownloadPhotoButton'
import { ErrorPlate } from '../Basic/ErrorPlate'
import { LoadingCircle } from '../Basic/LoadingCircle'
import { PersonTiny } from '../Basic/PersonTiny'

export const AddSong = () => {
	const { currentUser } = useAuth()
	const [songName, setSongName] = useState("")
	const [songCover, setSongCover] = useState("")
	const [songSrc, setSongSrc] = useState("")
	const [authorsInputValue, setAuthorsInputValue] = useState('')
	const [allAuthors, setAllAuthors] = useState([])
	const [chosenAuthors, setChosenAuthors] = useState(!currentUser.isAdmin ? [{ uid: currentUser.uid, photoURL: currentUser.photoURL, displayName: currentUser.displayName }] : [])
	const [releaseDate, setReleaseDate] = useState("")
	const [lyrics, setLyrics] = useState([])
	const [imageLocalPath, setImageLocalPath] = useState("")
	const [imageColors, setImageColors] = useState([])
	const [loadingAuthors, setLoadingAuthors] = useState(false)
	const [lyricsObject, setLyricsObject] = useState([])
	const [errorMessage, setErrorMessage] = useState("")
	const [showSuccessMessage, setShowSuccessMessage] = useState(false)
	let typingTimeout
	async function findAuthors(e) {
		setLoadingAuthors(true)
		setAllAuthors([])
		const response = firestore.collection("users")
			.where("displayName", "==", authorsInputValue)
		// .where('isAuthor', '==', true)
		const data = await response.get();
		if (data !== undefined) {
			data.docs.forEach(item => {
				setAllAuthors([...allAuthors, item.data()])
			})
			setLoadingAuthors(false)
		}
	}

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
			console.log("image")
			const validExtensions = [".jpg", ".png", ".jpeg"]
			if (validExtensions.find((ext) => file.name.substr(file.name.length - ext.length, ext.length) === ext)) isValid = true
			else setErrorMessage(`Format of your file is not valid. Download file with one of these: ${validExtensions.map(ex => " " + ex)}`)
		}
		else if (place === "songs/") {
			console.log("song")
			const validExtensions = [".mp3", ".mp4a", ".flac", ".wav", '.wma']
			if (validExtensions.find((ext) => file.name.substr(file.name.length - ext.length, ext.length) === ext)) isValid = true
			else setErrorMessage(`Format of your file is not valid. Download file with one of these: ${validExtensions.map(ex => ex)}`)
		}

		if (isValid) {
			console.log(file)
			setImageLocalPath(URL.createObjectURL(file))
			const storageRef = storage.ref()
			const fileRef = storageRef.child(place + file.name)
			await fileRef.put(file)
			setFunc(await fileRef.getDownloadURL())
		}
	}

	function transformLyricsToArrayOfObjects(e) {
		const arrayOfParagraphs = []
		let startSubstr = 0
		for (let i = 0; i < lyrics.length; i++) {
			if (lyrics[i] === '\n' || lyrics[i + 1] === undefined) {

				arrayOfParagraphs.push({
					startTime: 'undefined',
					text: lyrics.substr(startSubstr, i - startSubstr)
				})
				startSubstr = i + 1
			}
		}
		setLyricsObject(arrayOfParagraphs)
	}

	async function addSongToFirebase(e) {
		e.preventDefault()
		let uid = getUID()
		console.log(lyricsObject)
		setErrorMessage("")
		if (songName.length === 0) setErrorMessage("Song has to have some name")
		else if (chosenAuthors.length === 0) setErrorMessage('Song has to have at least 1 author')
		else if (songCover.length === 0) setErrorMessage('You didn\'t load song cover')
		else if (songSrc.length === 0) setErrorMessage('You didn\'t load song file')
		else if (releaseDate.length === 0) setErrorMessage('You have to set release date for a song')
		else {
			firestore.collection('songs').doc(uid).set(
				{
					id: uid,
					name: songName,
					songSrc: songSrc,
					authors: chosenAuthors,
					cover: songCover,
					listens: 0,
					releaseDate: releaseDate,
					lyrics: lyricsObject,
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
				setShowSuccessMessage(true)
				setImageColors([])
			}).catch(err => {
				setErrorMessage(err)
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

			
		}

	}

	useEffect(() => {
		if(showSuccessMessage){
			setTimeout(()=>{
				setShowSuccessMessage(false)
			}, 2000)
		}
	}, [showSuccessMessage])

	function timerUpFunc(func) {
		clearTimeout(typingTimeout)
		typingTimeout = setTimeout(func, 1000)
	}

	useEffect(() => {
		console.log(imageColors)
	}, [imageColors])

	function manuallyChangeColor(e, i) {
		// const tempArr = imageColors; tempArr[i] = e.taget.value;
		imageColors[i] = e.target.value
		setImageColors([...imageColors])
	}

	return (
		<div className="AddSong">
			<ColorExtractor src={imageLocalPath} getColors={(colors) => setImageColors(colors)} />
			<form onSubmit={addSongToFirebase}>
				<label>
					<h3>Song name</h3>
					<input type="text" placeholder="Enter song name" value={songName} onChange={(e) => setSongName(e.target.value)} />
				</label>
				<label>
					<h3>Song authors</h3>
					<input type="text" placeholder="Enter author name" value={authorsInputValue} onChange={(e) => setAuthorsInputValue(e.target.value)} style={{ marginBottom: '5px' }} onKeyUp={() => timerUpFunc(findAuthors)} onKeyDown={() => { return clearTimeout(typingTimeout) }} />
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
					<h3>Release Date</h3>
					<input type="date" name="" id="" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
				</label>

				{/* <label>
					<h3>Add to albums and playlists</h3>
					<input type="text" placeholder="Enter playlist name" value={authorsInputValue} onChange={(e) => setAuthorsInputValue(e.target.value)} onKeyDown={findAuthors} style={{ marginBottom: '5px' }} />
				</label> */}

				<ErrorPlate errorMessage = {errorMessage}/>

				<div style={{ width: '100%', display: 'flex' }}>
					{imageColors.map((color, index) => {
						return <input type="color" value={color} style={{ width: '100%', height: '60px', padding: '0', borderRadius: '0px' }} onChange={(e) => { manuallyChangeColor(e, index) }} />
					})}
				</div>

				<DownloadPhotoButton setErrorMessage = {setErrorMessage} setImageLocalPath = {setImageLocalPath} downloadedPhoto = {songCover} setDownloadedPhoto = {setSongCover} place = {'songsImages/'}/>

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
					<textarea name="" id="" placeholder={"Add song lyrics"} onKeyDown={transformLyricsToArrayOfObjects} onChange={(e) => setLyrics(e.target.value)}></textarea>
				</label>
				<button type="submit" className="addSongBtn">{!showSuccessMessage?"Add song":"Song Successfully added. Congrats!"}</button>
			</form>
		</div>
	)
}
