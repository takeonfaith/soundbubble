import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorPlate } from '../components/Basic/ErrorPlate'
import { FullScreenLoading } from '../components/Basic/FullScreenLoading'
import { BlurredBg } from '../components/SignIn-Up/BlurredBg'
import { TitleAndLogo } from '../components/SignIn-Up/TitleAndLogo'
import { useAuth } from '../functionality/AuthContext'
import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from '../utils/consts'

export const LogInPage = () => {
	const {login} = useAuth()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [loading, setLoading] = useState(false)
	const isValid = email.length !== 0 && password.length !== 0
	async function handleSubmit(e){
		e.preventDefault()
		if(!isValid){
			return setErrorMessage("One of your fields is totaly empty")
		}
		await login(email, password, setErrorMessage, setLoading)
	}
	return (
		<div className = "In-Up-Container">
			<div className="CentralPlate">
				<FullScreenLoading loading = {loading}/>
				<TitleAndLogo title="Log In"/>
				<ErrorPlate errorMessage = {errorMessage}/>
				<form onSubmit = {handleSubmit}>
					<input type="email" placeholder="Enter your Email" className="emailInput" onChange = {(e)=>setEmail(e.target.value)}/>
					<input type="password" name="" id="" placeholder="Enter your password" onChange = {(e)=>setPassword(e.target.value)}/>
					<div className="inAndUpBtns">
						<button className="upBtn" disabled = {loading}>
							Log In
						</button>
						<Link to = {SIGNUP_ROUTE}>
							<button className="inBtn" >
								Create new account
							</button>
						</Link>
					</div>
				</form>
			</div>
			<BlurredBg/>
		</div>
	)
}
