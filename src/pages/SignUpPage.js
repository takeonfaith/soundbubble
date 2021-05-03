import React from 'react'
import '../styles/SignIn-Up.css'
import { Link } from 'react-router-dom'
import {HOME_ROUTE, LOGIN_ROUTE} from '../utils/consts'
import { BlurredBg } from '../components/SignIn-Up/BlurredBg'
import { TitleAndLogo } from '../components/SignIn-Up/TitleAndLogo'
export const SignUpPage = () => {
	return (
		<div className="In-Up-Container">
			<div className="CentralPlate">
				<TitleAndLogo title = "Sign Up"/>
				<form>
					<input type="email" placeholder="Enter your Email" className="emailInput" />
					<input type="text" placeholder="Enter your first name" />
					<input type="password" name="" id="" placeholder="Create a password" />
					<div className="inAndUpBtns">
						<Link to = {HOME_ROUTE}>
							<button className="upBtn" >
								Sign Up
							</button>
						</Link>
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
