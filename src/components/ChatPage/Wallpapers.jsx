import React, { useState } from 'react'
import { useFetchFirebaseData } from '../../hooks/fetchFirebaseData'
import { LoadingCircle } from '../Loading/LoadingCircle'
import { WallpaperItem } from './WallpaperItem'

export const Wallpapers = ({chatId, currentWallpaper}) => {
	const [wallpaperList, setWallpaperList] = useState([])
	const [loading, setLoading] = useState(true)
	useFetchFirebaseData(setLoading,'chatWallpapers', undefined, setWallpaperList)
	return !loading?(
		<div className='Wallpapers'>
			<h2>Wallpapers</h2>
			<div className="wallpapreWrapper">
				<WallpaperItem chatId = {chatId} image={"undefined"}/>
				{wallpaperList.map((wallpaper, index) => {
					return <WallpaperItem chatId = {chatId} image={wallpaper.image} key={wallpaper.id} currentWallpaper = {currentWallpaper}/>
				})}
			</div>
		</div>
	):<LoadingCircle/>
}
