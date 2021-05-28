import React from 'react'
import { useSong } from '../../functionality/SongPlay/SongContext'
import {PlaylistItem} from '../AuthorPage/PlaylistItem'
import {BiFolderPlus} from 'react-icons/bi'
import { useModal } from '../../functionality/ModalClass'
import { CreatePlaylistPage } from './CreatePlaylistPage'
export const PlaylistsPage = () => {
	const {yourPlaylists} = useSong()
	const {toggleModal, setContent} = useModal()
	return (
		<div className = "PlaylistsPage">
			<button className = "createPlaylistBtn" onClick = {()=>{toggleModal(); setContent(<CreatePlaylistPage/>)}}>
				<BiFolderPlus/>
				Create Playlist
			</button>
			<div className="playlistsContainer">
				{yourPlaylists && yourPlaylists.map((playlist, index)=>{
					return <PlaylistItem playlist = {playlist} key = {index}/>
				})}
			</div>
		</div>
	)
}
