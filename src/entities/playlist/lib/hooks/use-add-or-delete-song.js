import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/auth'
import { useSong } from '../../../../contexts/song'
import sortUserPlaylists from '../../../../features/author/lib/sort-user-playlists'
import { firestore } from '../../../../firebase'

export const useAddOrDeleteSong = (playlist, songId) => {
	const [playlistSongs, setPlaylistSongs] = useState([])
	const [isAdded, setIsAdded] = useState(false)
	const { currentUser } = useAuth()
	const { currentSong } = useSong()
	const songData = songId || currentSong
	useEffect(() => {
		const response = firestore.collection('playlists').doc(playlist.id).onSnapshot(res => {
			if (res.exists) setPlaylistSongs(res.data().songs)
		})
		return () => response()
	}, [firestore])

	useEffect(() => {
		setIsAdded(playlistSongs.includes(songData))
	}, [playlistSongs, songData])

	function addOrDelete() {
		console.log(playlistSongs, playlist);
		if (playlistSongs.length > 0 && playlist.id !== undefined) {
			if (playlistSongs.includes(songData)) {
				const newSongsList = playlistSongs.filter(songNum => songNum !== songData)
				firestore.collection('playlists').doc(playlist.id).update({
					songs: newSongsList
				})
				return
			}

			const newSongsList = playlistSongs
			newSongsList.unshift(songData)
			firestore.collection('playlists').doc(playlist.id).update({
				songs: newSongsList
			})

			sortUserPlaylists(playlist, currentUser)
		}
	}

	return [addOrDelete, isAdded]
}
