import React, { useEffect, useState } from 'react'
import { firestore, storage } from '../../firebase'
import { ColorExtractor } from 'react-color-extractor'
import { MdModeEdit } from 'react-icons/md'
export const CustomizeAuthor = ({ author }) => {
	const [authorName, setPlaylistName] = useState(author.displayName)
	const [authorCover, setAuthorCover] = useState(author.photoURL)
	const [imageLocalPath, setImageLocalPath] = useState('')
	const [imageColors, setImageColors] = useState(author.imageColors)

	async function onFileChange(e, place, setFunc) {
		const file = e.target.files[0]
		setImageLocalPath(URL.createObjectURL(file))
		const storageRef = storage.ref()
		const fileRef = storageRef.child(place + file.name)
		await fileRef.put(file)
		setFunc(await fileRef.getDownloadURL())
	}

	function updateAuthorInFirebase(e) {
		e.preventDefault()
		firestore.collection('users').doc(author.uid).update(
			{
				displayName: authorName,
				photoURL: authorCover,
				imageColors: imageColors,
			}
		)
	}

	return (
		<div className="AddSong">
			<ColorExtractor src={imageLocalPath} getColors={(colors) => setImageColors(colors)} />
			<form onSubmit={e => e.preventDefault()}>
				<div style = {{width:'100%', display:'flex', justifyContent:'center'}}>
					<div className="chatInfoImage" style={{ backgroundImage: `url(${authorCover})` }}>
						<label className="changePhoto">
							<MdModeEdit />
							Change photo
							<input type="file" style={{ display: 'none' }} onChange={(e) => onFileChange(e, 'chatCovers/', setAuthorCover)} />
						</label>
					</div>
				</div>
				<label>
					<h3>Your name</h3>
					<input type="text" placeholder="Enter your name" value={authorName} onChange={(e) => setPlaylistName(e.target.value)} required />
				</label>
				<button type="button" className="addSongBtn" onClick={updateAuthorInFirebase}>Update author</button>
			</form>
		</div>
	)
}

