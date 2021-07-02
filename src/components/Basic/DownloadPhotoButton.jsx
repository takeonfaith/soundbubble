import React from 'react'
import {AiOutlineCloudDownload} from 'react-icons/ai'
import { storage } from '../../firebase'
export const DownloadPhotoButton = ({setErrorMessage, setImageLocalPath, downloadedPhoto, setDownloadedPhoto, place}) => {
	async function onFileChange(e, place, setFunc) {
		setErrorMessage("")
		const file = e.target.files[0]
		let isValid = false
		if (place === 'songsImages/' || place === 'chatCovers/') {
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
	return (
		<label className="downloadFile">
			<div className="downloadPhoto">
				<span className="downloadBtnText">
					<AiOutlineCloudDownload />
					Download song cover
				</span>
				<span className="photoLoadLine" style={downloadedPhoto !== '' ? { width: '100%' } : {}}></span>
			</div>
			<input type="file" name="" id="" onChange={(e) => onFileChange(e, place, setDownloadedPhoto)} />
		</label>
	)
}
