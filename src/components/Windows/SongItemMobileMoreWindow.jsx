import React from 'react'
import { FiShare, FiInfo, FiFlag, FiUsers } from 'react-icons/fi';
import { MdPlaylistAdd, MdKeyboardArrowRight } from 'react-icons/md';
import { BiEditAlt } from 'react-icons/bi';
import { useModal } from '../../contexts/ModalContext';
import AddOrDeleteButtonFull from '../FullScreenPlayer/AddOrDeleteSongButton'
import { AddToPlaylists } from '../FullScreenPlayer/AddToPlaylists'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'
import { SongInfo } from '../Basic/SongInfo'
import { AuthorsList } from '../FullScreenPlayer/AuthorsList'
import { EditSong } from '../AdminAndAuthor/EditSong';
import { useAuth } from '../../contexts/AuthContext';
export const SongItemMobileMoreWindow = ({ song }) => {
	const { setContent } = useModal()
	const {currentUser} = useAuth()
	return (
		<div className="SongItemMobileMoreWindow">
			<div className="simpleSongElement" style = {{background:song.imageColors[0]}}>
				<div className="simpleSongElementImage" >
					<img loading = "lazy" src={song.cover} alt="" />
				</div>
				<span>{song.name}</span>
			</div>
			{currentUser.isAdmin ? <div className="songItemMenuWindowItem" onClick = {()=>{setContent(<EditSong song = {song}/>)}}><BiEditAlt />Edit</div> : null}
			<div className="songItemMenuWindowItem"><AddOrDeleteButtonFull song={song} /></div>
			<div className="songItemMenuWindowItem" onClick = {()=>setContent(<AddToPlaylists song={song} />)}>
				<MdPlaylistAdd />Add to playlist
			</div>
			<div className="songItemMenuWindowItem" onClick={() => { setContent(<FriendsListToShareWith item={song} whatToShare={"song"} />) }}>
				<FiShare />Share
			</div>
			<div className="songItemMenuWindowItem" onClick={() => { setContent(<SongInfo song={song} />) }}><FiInfo />Info</div>
			<div className="songItemMenuWindowItem"><FiFlag />Flag</div>
			<div className="songItemMenuWindowItem" onClick={() => { setContent(<AuthorsList listOfAuthors={song.authors} title={"Authors"} />) }}><FiUsers />Authors</div>
		</div>
	)
}
