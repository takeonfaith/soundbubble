import React from 'react'
import { firestore } from '../../firebase'

export const WallpaperItem = ({chatId, image, currentWallpaper}) => {
	function changeChatWallpaper(){
		firestore.collection('chats').doc(chatId).update({
			wallpaper:image
		})
	}
	
	return (
		<div className = {"WallpaperItem " + (image === currentWallpaper?"active":"")} onClick = {changeChatWallpaper} style = {image === "undefined"?{background:'var(--playlistsColor)'}:{}}>
			{image !== "undefined" ?<img src={image} alt="" />:null}
		</div>
	)
}
