import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { playlists } from '../../data/playlists'
import { MoreBtn } from '../Basic/MoreBtn'
import { PlaylistItem } from './PlaylistItem'

export const Playlists = ({ authorsData }) => {
	const [authorsPlaylists, setAuthorsPlaylists] = useState([])
	const [openAllPlaylists, setOpenAllPlaylists] = useState(false)
	useEffect(() => {
		if (playlists[authorsData.name] === undefined) return setAuthorsPlaylists([])

		setAuthorsPlaylists(playlists["allPlaylists"].filter(el => playlists[authorsData.name].includes(el.id)))
	}, [authorsData])

	return authorsPlaylists.length ?
		(
			<div className="playLists">
				<div className="topTitle">
					<h2>Albums</h2>
					<MoreBtn func={() => setOpenAllPlaylists(!openAllPlaylists)} lenOfList = {authorsPlaylists.length} boolVal = {openAllPlaylists}/>
				</div>
				<div className="playlistsWrapper">
					{authorsPlaylists.map((playlist, index) => {
						if(!openAllPlaylists){
							if(index < 5){
								return (
									<PlaylistItem playlist={playlist} key={index} />
								)
							}
						}
						else{
							return (
								<PlaylistItem playlist={playlist} key={index} />
							)
						}
					})}
				</div>
			</div>
		) :
		null
}
