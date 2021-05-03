import React from 'react'
import { Link } from 'react-router-dom'
import { BlurredBg } from '../components/SignIn-Up/BlurredBg'
import { TitleAndLogo } from '../components/SignIn-Up/TitleAndLogo'
import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from '../utils/consts'

export const LogInPage = () => {
	return (
		<div className = "In-Up-Container">
			<div className="CentralPlate">
				<TitleAndLogo title="Log In"/>
				<form>
					<input type="email" placeholder="Enter your Email" className="emailInput" />
					<input type="password" name="" id="" placeholder="Enter your password" />
					<div className="inAndUpBtns">
						<Link to = {HOME_ROUTE}>
							<button className="upBtn" >
								Log In
							</button>
						</Link>
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
