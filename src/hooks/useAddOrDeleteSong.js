import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSong } from '../contexts/SongContext'
import { firestore } from '../firebase'

export const useAddOrDeleteSong = (playlistId, songId) => {
	const [playlistSongs, setPlaylistSongs] = useState([])
	const [isAdded, setIsAdded] = useState(false)
	const { currentUser } = useAuth()
	const { currentSong } = useSong()
	const songData = songId || currentSong
	useEffect(() => {
		const response = firestore.collection('playlists').doc(playlistId).onSnapshot(res => {
			if (res.exists) setPlaylistSongs(res.data().songs)
		})
		return () => response()
	}, [firestore])

	useEffect(() => {
		setIsAdded(playlistSongs.includes(songData))
	}, [playlistSongs, songData])

	function addOrDelete() {
		if (playlistSongs.length > 0 && playlistId !== undefined) {
			if (playlistSongs.includes(songData)) {
				const newSongsList = playlistSongs.filter(songNum => songNum !== songData)
				firestore.collection('playlists').doc(playlistId).update({
					songs: newSongsList
				})
				return
			}

			const newSongsList = playlistSongs
			newSongsList.unshift(songData)
			firestore.collection('playlists').doc(playlistId).update({
				songs: newSongsList
			})

			const sortedPlaylists = [playlistId, ...currentUser.ownPlaylists.filter(id => id !== playlistId)]
			firestore.collection('users').doc(currentUser.uid).update({
				ownPlaylists: sortedPlaylists
			})
		}
	}

	return [addOrDelete, isAdded]
}
