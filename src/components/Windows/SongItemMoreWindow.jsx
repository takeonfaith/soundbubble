import React from 'react'
import { FiShare, FiInfo, FiFlag } from 'react-icons/fi';
import { MdPlaylistAdd, MdKeyboardArrowRight } from 'react-icons/md';
import { useModal } from '../../contexts/ModalContext';
import AddOrDeleteButtonFull from '../FullScreenPlayer/AddOrDeleteSongButton'
import {AddToPlaylists} from '../FullScreenPlayer/AddToPlaylists'
import {FriendsListToShareWith} from '../Basic/FriendsListToShareWith'
import {SongInfo} from '../Basic/SongInfo'
export const SongItemMoreWindow = ({openMoreWindow, song, moreWindowPosRelativeToViewport}) => {
	const {toggleModal, setContent} = useModal()
	return openMoreWindow ? (
		(
			<div className="songItemMenuWindow" style={moreWindowPosRelativeToViewport > (window.innerHeight / 2) + 100 ? { top: 'auto', bottom: '110%' } : { top: '110%', bottom: 'auto' }} onClick={e => e.stopPropagation()}>
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
				<div className="songItemMenuWindowItem"><FiFlag />Flag</div>
			</div>
		)

	) : null

}
