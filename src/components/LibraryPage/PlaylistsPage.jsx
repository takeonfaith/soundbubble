import React from 'react'
import { useSong } from '../../contexts/SongContext'
import { PlaylistItem } from '../AuthorPage/PlaylistItem'
import { BiFolderPlus } from 'react-icons/bi'
import { useModal } from '../../contexts/ModalContext'
import { CreatePlaylistPage } from './CreatePlaylistPage'
import { SearchBar } from '../Basic/SearchBar'
import { useState } from 'react'
export const PlaylistsPage = () => {
	const { yourPlaylists } = useSong()
	const [playlistsDisplay, setPlaylistsDisplay] = useState(yourPlaylists)
	const { toggleModal, setContent } = useModal()
	const [searchValue, setSearchValue] = useState("")
	return (
		<div className="PlaylistsPage">
			<div style = {{display:'flex'}} className = "searchAndCreatePlaylist">
				<SearchBar value = {searchValue} setValue = {setSearchValue} setResultPlaylists = {setPlaylistsDisplay} defaultSearchMode = {'playlists'} defaultPlaylistsListValue = {yourPlaylists}/>
				<button className="createPlaylistBtn" onClick={() => { toggleModal(); setContent(<CreatePlaylistPage />) }}>
					<BiFolderPlus />
					Create Playlist
				</button>
			</div>
			<div className="playlistsContainer">
				{playlistsDisplay && playlistsDisplay.map((playlist, index) => {
					return <PlaylistItem playlist={playlist} key={playlist.id} />
				})}
			</div>
		</div>
	)
}
