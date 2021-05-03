import React from 'react'
import Logo from "../../images/Logo3.svg"
export const TitleAndLogo = ({title}) => {
	return (
		<div className="titleAndLogo">
				<div className="title">
					<h1>{title}</h1>
				</div>
				<div className="logo">
					<img src={Logo} alt="" />
				</div>
		</div>
	)
}
