import React from 'react'
import { useState } from 'react'
import {FiMenu} from 'react-icons/fi'
import {IoIosArrowForward} from 'react-icons/io'
import { useModal } from '../../functionality/ModalClass'
import "../../styles/Settings.css"
import { GeneralSettings } from './GeneralSettings'
export const SettingsList = () => {
	const {setContent} = useModal()
	const settingsList = [
		{
			id:0, 
			title:'General',
			icon:<FiMenu/>,
			to:<GeneralSettings/>,
			color:'var(--red)'
		},
		{
			id:1, 
			title:'General',
			icon:<FiMenu/>,
			to:<h2>Test</h2>,
			color:'var(--lightBlue)'
		},
		{
			id:2, 
			title:'General',
			icon:<FiMenu/>,
			to:<h2>Test</h2>,
			color:'var(--green)'
		}
	]
	return (
		<div className = "SettingsList">
			{settingsList.map(settingItem=>{
				return (
					<button className = "SettingItem" style = {{color:settingItem.color}} key = {settingItem.id} onClick = {()=>setContent(settingItem.to)}>
						<div className = "settingItemIconAndTitle">
							{settingItem.icon}
							<h3>{settingItem.title}</h3>
						</div>
						<IoIosArrowForward/>
					</button>
				)
			})}
		</div>
	)
}
