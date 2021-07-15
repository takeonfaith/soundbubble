import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { findAuthorsAlbums } from '../../functions/find/findAuthorsAlbums'
import { AlbumList } from '../Lists/AlbumList'

export const Playlists = ({ authorsData }) => {
	const {currentUser} = useAuth()
	const [authorsPlaylists, setAuthorsPlaylists] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		findAuthorsAlbums(authorsData, setAuthorsPlaylists, currentUser.uid, setLoading)
	}, [authorsData.ownPlaylists])

	return <AlbumList listOfAlbums = {authorsPlaylists} title = {currentUser.isAuthor?"Albums":"Playlists"} loading = {loading}/>
}
