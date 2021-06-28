import React from 'react'
import { BiAlbum } from 'react-icons/bi'
import { FiPlayCircle, FiPlusCircle, FiShare } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useModal } from '../../functionality/ModalClass'
import shortWord from '../../functions/shortWord'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'

export const TinyPlaylist = ({playlist}) => {
	const {toggleModal, setContent} = useModal()
	return (
		<div className="TinyPlaylist">
			<div className="TinyPlaylistBtns">
				<button onClick = {()=>{toggleModal();setContent(<FriendsListToShareWith item = {playlist} whatToShare = {"playlist"}/>)}}><FiShare/></button>
				<button><FiPlusCircle/></button>
				<Link to={`/albums/${playlist.id}`}>
					<button><BiAlbum /></button>
				</Link>
				<button><FiPlayCircle/></button>
			</div>
			<div className="TinyPlaylistImg">
				<img src={playlist.image} alt="" />
			</div>
			<div style = {{display:'flex', flexDirection:'column'}}>
				<span>
					{shortWord(playlist.name, 15) }
				</span>
				<span style = {{fontSize:'0.8em', color:'grey', fontWeight:'500'}}>
					{playlist.isAlbum?"album":"playlist"}
				</span>
			</div>
		</div>
	)
}
