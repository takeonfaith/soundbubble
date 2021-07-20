import React from 'react'
import { FiShare, FiInfo } from 'react-icons/fi';
import { MdPlaylistAdd, MdKeyboardArrowRight } from 'react-icons/md';
import { BiEditAlt } from 'react-icons/bi';
import { useModal } from '../../contexts/ModalContext';
import AddOrDeleteButtonFull from '../FullScreenPlayer/AddOrDeleteSongButton'
import { AddToPlaylists } from '../FullScreenPlayer/AddToPlaylists'
import { FriendsListToShareWith } from '../Lists/FriendsListToShareWith'
import { SongInfo } from '../Info/SongInfo'
import { useAuth } from '../../contexts/AuthContext';
import { EditSong } from '../AdminAndAuthor/EditSong';
export const SongItemMoreWindow = ({ openMoreWindow, song, moreWindowPosRelativeToViewport }) => {
	const { toggleModal, setContent } = useModal()
	const { currentUser } = useAuth()
	return openMoreWindow ? (
		(
			<div className="songItemMenuWindow" style={moreWindowPosRelativeToViewport > (window.innerHeight / 2) + 100 ? { top: 'auto', bottom: '110%' } : { top: '110%', bottom: 'auto' }} onClick={e => e.stopPropagation()}>
				{currentUser.isAdmin || song.authors.find(el=>el.uid === currentUser.uid) ? <div className="songItemMenuWindowItem" onClick = {()=>{toggleModal(); setContent(<EditSong song = {song}/>)}}><BiEditAlt />Edit</div> : null}
				<div className="songItemMenuWindowItem"><AddOrDeleteButtonFull song={song} /></div>
				<div className="songItemMenuWindowItem">
					<div className="songItemMenuWindow inner">
						<AddToPlaylists song={song} />
					</div>
					<MdPlaylistAdd />Add to playlist <MdKeyboardArrowRight />
				</div>
				<div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<FriendsListToShareWith item={song} whatToShare={"song"} />) }}>
					<FiShare />Share
				</div>
				<div className="songItemMenuWindowItem" onClick={() => { toggleModal(); setContent(<SongInfo song={song} />) }}><FiInfo />Info</div>
			</div>
		)

	) : null

}
