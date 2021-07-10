import React, { useState } from 'react'
import '../styles/SignIn-Up.css'
import { Link } from 'react-router-dom'
import {HOME_ROUTE, LOGIN_ROUTE} from '../utils/consts'
import { BlurredBg } from '../components/SignIn-Up/BlurredBg'
import { TitleAndLogo } from '../components/SignIn-Up/TitleAndLogo'
import { RadioBtn } from '../components/SignIn-Up/RadioBtn'
import { useAuth } from '../contexts/AuthContext'
import {AiOutlineCloudDownload} from 'react-icons/ai'
import { storage } from '../firebase'
import { ColorExtractor } from 'react-color-extractor'
import { FullScreenLoading } from '../components/Basic/FullScreenLoading'
export const SignUpPage = () => {
	const [currentRoleChoice, setCurrentRoleChoice] = useState(1)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [name, setName] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [loading, setLoading] = useState(false)
	const {signup} = useAuth()
	const [photoURL, setPhotoURL] = useState("")
	const isValid = email.length !== 0 && password.length !== 0 && name.length !== 0
	const [imageLocalPath, setImageLocalPath] = useState('')
	const [imageColors, setImageColors] = useState([])
	async function onFileChange(e){
		const file = e.target.files[0]
		setImageLocalPath(URL.createObjectURL(file))
		const storageRef = storage.ref()
		const fileRef = storageRef.child(`usersImages/${file.name}`)
		await fileRef.put(file)
		setPhotoURL(await fileRef.getDownloadURL())
	}

	async function handleSubmit(e){
		e.preventDefault()
		if(!isValid){
			return setErrorMessage("One of your fields is totaly empty")
		}

		await signup(email, name, password, currentRoleChoice, photoURL, imageColors, setErrorMessage, setLoading)
	}
	return (
		<div className="In-Up-Container">
			<ColorExtractor src = {imageLocalPath} getColors = {(colors)=>setImageColors(colors)}/>
			<div className="CentralPlate">
				<FullScreenLoading loading = {loading}/>
				<TitleAndLogo title = "Sign Up"/>
				
				{errorMessage &&
					<div className = "Alert">
						{errorMessage}
					</div>
				}
				<form onSubmit = {handleSubmit}>
					<input type="email" placeholder="Enter your Email" className="emailInput" onChange = {(e)=>setEmail(e.target.value)}/>
					<input type="text" placeholder="Enter your name" onChange = {(e)=>setName(e.target.value)}/>
					<input type="password" name="" id="" placeholder="Create a password" onChange = {(e)=>setPassword(e.target.value)}/>
					<div style = {{display:'flex', width:'100%', justifyContent:'center', margin:'5px 0 15px 0'}}>
						<RadioBtn label = "User" onClick = {()=>setCurrentRoleChoice(0)} currentActive = {currentRoleChoice} id = {0}/>
						<RadioBtn label = "Author" onClick = {()=>setCurrentRoleChoice(1)} currentActive = {currentRoleChoice} id = {1}/>
					</div>
					<label className = "downloadFile">
						<div className = "downloadPhoto">
							{photoURL === ''?<span className = "downloadBtnText">
								<AiOutlineCloudDownload/>
								Download photo
							</span>:<span className = "downloadBtnText">Done</span>}
							<span className="photoLoadLine" style = {photoURL !== ''?{width:'100%'}:{}}></span>
						</div>
						<input type="file" name="" id="" onChange = {onFileChange}/>
					</label>
					<div className="inAndUpBtns">
						<button className="upBtn" type = "submit" disabled = {loading}>
							Sign Up
						</button>
						<Link to = {LOGIN_ROUTE}>
							<button className="inBtn" >
								Already have the account
							</button>
						</Link>
					</div>
				</form>
			</div>
			<BlurredBg/>
		</div>
	)
}
