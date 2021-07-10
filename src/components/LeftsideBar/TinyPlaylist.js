import React from 'react'
import { BiAlbum } from 'react-icons/bi'
import { FiPlayCircle, FiPlusCircle, FiShare } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useModal } from '../../contexts/ModalContext'
import shortWord from '../../functions/shortWord'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'
import { Hint } from '../Basic/Hint'

export const TinyPlaylist = ({playlist}) => {
	const {toggleModal, setContent} = useModal()
	return (
		<div className="TinyPlaylist">
			<div className="TinyPlaylistBtns">
				<button>
					<Hint text={'add song'} />
					<FiPlusCircle/>
				</button>
				<Link to={`/albums/${playlist.id}`}>
					<button>
						<Hint text={'album'} /><BiAlbum />
					</button>
				</Link>
				<button>
					<Hint text={'play'} />
					<FiPlayCircle/>
				</button>
			</div>
			<div className="TinyPlaylistImg">
				<img src={playlist.image} alt="" />
			</div>
			<div style = {{display:'flex', flexDirection:'column'}}>
				<span>
					{shortWord(playlist.name, 13) }
				</span>
				<span style = {{fontSize:'0.8em', color:'grey', fontWeight:'500'}}>
					{playlist.isAlbum?"album":"playlist"}
				</span>
			</div>
		</div>
	)
}
