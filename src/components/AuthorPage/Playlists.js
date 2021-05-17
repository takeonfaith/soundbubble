import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { playlists } from '../../data/playlists'
import { firestore } from '../../firebase'
import { MoreBtn } from '../Basic/MoreBtn'
import { PlaylistItem } from './PlaylistItem'

export const Playlists = ({ authorsData }) => {
	const [authorsPlaylists, setAuthorsPlaylists] = useState([])
	const [openAllPlaylists, setOpenAllPlaylists] = useState(false)

	async function findAuthorsAlbums() {
		setAuthorsPlaylists([])
		const tempArray = []
		if(authorsData.ownPlaylists !== undefined && authorsData.ownPlaylists.length !== 0){
			const response = firestore.collection("playlists")
				.where("id", "in", authorsData.ownPlaylists)
			const data = await response.get();
			data.docs.forEach(item => {
				tempArray.push(item.data())
			})
		}
		tempArray.sort((a, b)=> new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
		setAuthorsPlaylists(tempArray)
	}

	useEffect(() => {
		findAuthorsAlbums()
	}, [authorsData.ownPlaylists])

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
