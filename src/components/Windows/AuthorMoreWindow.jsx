import React from 'react'
import { useModal } from '../../contexts/ModalContext';
import { FiFlag, FiInfo, FiShare } from 'react-icons/fi'
import {FriendsListToShareWith} from '../Lists/FriendsListToShareWith'
import { AlbumInfo } from '../Info/AlbumInfo';
import { AuthorInfo } from '../Info/AuthorInfo';
export const AuthorMoreWindow = ({data}) => {
	const {setContent} = useModal()
	return (
		<div className="AuthorMoreWindow" style={{ top: '110%', bottom: 'auto' }} onClick={e => e.stopPropagation()} >
			<div className="songItemMenuWindowItem" onClick={() => {setContent(<FriendsListToShareWith item={data} whatToShare={data.authors !== undefined ? 'playlist' : 'author'} />) }}>
				<FiShare />Share
			</div>
			<div className="songItemMenuWindowItem" onClick={() => { setContent(data.authors !== undefined ? <AlbumInfo album={data} /> : <AuthorInfo author={data} />) }}><FiInfo />Info</div>
		</div>
	)
}
