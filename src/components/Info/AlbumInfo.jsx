import React, { useEffect, useState } from 'react'
import { useSong } from '../../contexts/SongContext'
import displayDate from '../../functions/display/displayDate'
import { PersonTinyVerticalItem } from '../AuthorPage/PersonTinyVerticalItem'
import { useModal } from '../../contexts/ModalContext'
import { FriendsListToShareWith } from '../Basic/FriendsListToShareWith'
import { LoadingCircle } from '../Loading/LoadingCircle'
import { FiHeadphones, FiUserPlus } from 'react-icons/fi'
import { ImCheckmark } from 'react-icons/im'
import { SeeMoreRoundButton } from '../Buttons/SeeMoreRoundButton'
import { TinyPersonsList } from '../Lists/TinyPersonsList'
export const AlbumInfo = ({ album }) => {
	const { setContent } = useModal()
	const { yourFriends } = useSong()
	const [friendsThatHaveThisAlbum, setFriendsThatHaveThisAlbum] = useState([])
	const [loading, setLoading] = useState(true)
	async function findFriendsThatHaveThisAlbum() {
		setLoading(true)
		setFriendsThatHaveThisAlbum([])
		yourFriends.forEach(friend => {
			if (friend.addedPlaylists.includes(album.id)) setFriendsThatHaveThisAlbum(prev => [...prev, friend])
		})
		setLoading(false)
	}

	useEffect(() => {
		findFriendsThatHaveThisAlbum()
	}, [album.uid])

	return (
		<div className='SongInfo'>
			<div className="songImage" style={{ backgroundImage: `url(${album.image})` }}></div>
			<div className="songInfoContent">
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span style={{ opacity: ".5", fontWeight: 500, fontSize: '.7em' }}>{album.isAlbum ? "Album" : "Playlist"}</span>
					<h3 style={{ color: album.imageColors[1] }}>{album.name}</h3>
				</div>
				<div style={{ display: 'flex', opacity: '0.6', fontSize: '.9em', position: "relative" }} className="listensAndDate">
					<p className="infoListens" style={{ marginRight: '20px', position: 'relative' }}>{album.listens}<FiHeadphones /></p>
					<p className="infoListens" style={{ marginRight: '20px', position: 'relative' }}>{album.subscribers} <FiUserPlus /></p>
					<span>{displayDate(album.creationDate)}</span>
				</div>
				<h4 style={{ margin: '10px 0' }}>{friendsThatHaveThisAlbum.length > 0 ? 'Friends subscribed' : 'None of your friends subscribed'}</h4>
				{!loading ? <div style={{ display: 'flex' }}>
					{friendsThatHaveThisAlbum.length > 0 ?
						<>
							{friendsThatHaveThisAlbum.map((person, index) => {
								if (index < 2) return <PersonTinyVerticalItem person={person} key={person.uid} />
							})}
							{friendsThatHaveThisAlbum.length > 2 ? <SeeMoreRoundButton onClick={() => setContent(<TinyPersonsList listOfPeople={friendsThatHaveThisAlbum} title={`Friends subscribed to ${album.name}`} />)} /> : null}
						</> :
						<button className="shareBtn" style={{ minHeight: '35px', background: album.imageColors[0] }} onClick={() => { setContent(<FriendsListToShareWith item={album} whatToShare={'playlist'} />) }}>Share</button>}
				</div> :
					<div style={{ position: 'relative', height: '50px' }}><LoadingCircle top={"50%"} /></div>}
			</div>
		</div>
	)
}

