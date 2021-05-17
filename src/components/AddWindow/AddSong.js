import React, { useEffect, useState } from 'react'
import { ColorExtractor } from 'react-color-extractor'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { FiPlus, FiXCircle } from 'react-icons/fi'
import { auth, firestore, storage } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import getUID from '../../functions/getUID'
import { PersonTiny } from '../Basic/PersonTiny'
import { Slider } from '../Tools/Slider'

export const AddSong = () => {
	const [songName, setSongName] = useState("")
	const [songCover, setSongCover] = useState("")
	const [songSrc, setSongSrc] = useState("")
	const [authorsInputValue, setAuthorsInputValue] = useState('')
	const [allAuthors, setAllAuthors] = useState([])
	const [chosenAuthors, setChosenAuthors] = useState([])
	const [releaseDate, setReleaseDate] = useState("")
	const [lyrics, setLyrics] = useState([])
	const [imageLocalPath, setImageLocalPath] = useState("")
	const [imageColors, setImageColors] = useState([])
	async function findAuthors(e) {
		setAllAuthors([])
		if (e.key === 'Enter' && e.ctrlKey) {

			const response = firestore.collection("users")
				.where("displayName", "==", authorsInputValue)
				.where('isAuthor', '==', true)
			const data = await response.get();
			data.docs.forEach(item => {
				setAllAuthors([...allAuthors, item.data()])
			})
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
		const file = e.target.files[0]
		setImageLocalPath(URL.createObjectURL(file))
		const storageRef = storage.ref()
		const fileRef = storageRef.child(place + file.name)
		await fileRef.put(file)
		setFunc(await fileRef.getDownloadURL())
	}

	function transformLyricsToArrayOfObjects(e) {
		// if(e.key === 'Enter' && e.ctrlKey){
		// 	console.log("rfgfer")
		// 	const arr = JSON.parse(lyrics)
		// 	console.log(arr)
		// }
	}

	async function addSongToFirebase(e) {
		e.preventDefault()
		let uid = getUID()
		if(chosenAuthors.length !== 0){
			firestore.collection('songs').doc(uid).set(
				{
					id: uid,
					name: songName,
					songSrc: songSrc,
					authors: chosenAuthors,
					cover: songCover,
					listens: 0,
					releaseDate: releaseDate,
					lyrics: lyrics,
					imageColors:imageColors
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
			}).catch(err => {
				console.log(err)
			})
	
			chosenAuthors.forEach(async author=>{
				const authorRef = await firestore.collection('users').doc(author.uid).get()
				const authorData = authorRef.data()
				const authorSongs = authorData.ownSongs
				authorSongs.push(uid)
				firestore.collection('users').doc(author.uid).update({
					ownSongs:authorSongs
				})
			})
		}

	}
	
	return (
		<div className="AddSong">
			<ColorExtractor src = {imageLocalPath} getColors = {(colors)=>setImageColors(colors)}/>
			<form onSubmit={addSongToFirebase}>
				<label>
					<h3>Song name</h3>
					<input type="text" placeholder="Enter song name" value={songName} onChange={(e) => setSongName(e.target.value)} required />
				</label>
				<label>
					<h3>Song authors</h3>
					<input type="text" placeholder="Enter author name" value={authorsInputValue} onChange={(e) => setAuthorsInputValue(e.target.value)} onKeyDown={findAuthors} style={{ marginBottom: '5px' }} />
					<div className="chosenAuthorsList">
						{chosenAuthors.map((author) => {
							return (
								<div className="chosenAuthorItem">
									<span>{author.displayName}</span>
									<FiXCircle onClick={() => removeAuthorFromList(author)} />
								</div>
							)
						})}
					</div>
					<div className="authorsResult">
						{allAuthors.map((data, index) => {
							return (
								<PersonTiny data={data} onClick={() => addAuthor(data)} style={chosenAuthors.includes(data.uid) ? { background: 'var(--green)' } : {}} key={index} />
							)
						})}
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

				<label className="downloadFile">
					<div className="downloadPhoto">
						<span className="downloadBtnText">
							<AiOutlineCloudDownload />
									Download song cover
								</span>
						<span className="photoLoadLine" style={songCover !== '' ? { width: '100%' } : {}}></span>
					</div>
					<input type="file" name="" id="" onChange={(e) => onFileChange(e, 'songsImages/', setSongCover)} />
				</label>

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

				{/* <label>
							<textarea name="" id="" placeholder = {"Add song lyrics:\ne.g. bla-bla-bla[time-when-it-plays]"} onKeyDown = {transformLyricsToArrayOfObjects} onChange = {(e)=>setLyrics(e.target.value)}></textarea>
						</label> */}
				<button type="submit" className="addSongBtn">Add song</button>
				{imageColors.map(color=>{
					return <div style = {{background:color, width:'30px', height:'30px'}}></div>
				})}
			</form>
		</div>
	)
}
