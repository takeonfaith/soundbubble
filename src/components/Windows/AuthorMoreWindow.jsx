import React from 'react'
import { useModal } from '../../contexts/ModalContext';
import { FiFlag, FiInfo, FiShare } from 'react-icons/fi'
import {FriendsListToShareWith} from '../Basic/FriendsListToShareWith'
export const AuthorMoreWindow = ({data}) => {
	const {setContent} = useModal()
	return (
		<div className="AuthorMoreWindow" style={{ top: '110%', bottom: 'auto' }} onClick={e => e.stopPropagation()} >
			<div className="songItemMenuWindowItem" onClick={() => {setContent(<FriendsListToShareWith item={data} whatToShare={data.authors !== undefined ? 'playlist' : 'author'} />) }}>
				<FiShare />Share
			</div>
			<div className="songItemMenuWindowItem" onClick={() => {setContent(<h2>test</h2>) }}><FiInfo />Info</div>
			<div className="songItemMenuWindowItem"><FiFlag />Flag</div>
		</div>
	)
}
