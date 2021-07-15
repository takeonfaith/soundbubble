import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSong } from '../contexts/SongContext'
import { firestore } from '../firebase'

export const usePlaylistSongs = (playlist, playlistSongs, setPlaylistSongs) => {
	const {currentSongPlaylistSource, playSong, setCurrentSongQueue, setCurrentSong, setPlay, songRef, setCurrentSongInQueue, setCurrentSongPlaylistSource} = useSong()
	const {currentUser} = useAuth()
	function fetchSongsInAlbum() {
		setPlaylistSongs([])
		if (playlist.length !== 0) {
			playlist.songs.map(async songId => {
				let albumSong = (await firestore.collection('songs').doc(songId).get()).data()
				setPlaylistSongs(prev => [...prev, albumSong])
			})
		}
	}

	function playChosenPlaylist(e) {
		e.preventDefault()
		if (currentSongPlaylistSource.name === playlist.name) {
			playSong()
			return
		}
		fetchSongsInAlbum()

	}

	useEffect(() => {
		if (playlistSongs.length) {
			const source = { source: `/albums/${playlist.id}`, name: playlist.name, image: playlist.image, songsList: playlistSongs }
			const listSongsIds = playlistSongs.map(song => song.id)
			setCurrentSongQueue(playlistSongs)
			setCurrentSongInQueue(0)
			setCurrentSong(playlistSongs[0].id)
			songRef.current.play()
			setPlay(true)
			setCurrentSongPlaylistSource(source)
			firestore.collection('users').doc(currentUser.uid).update({
				lastSongPlayed: playlistSongs[0].id,
				lastQueue: {
					image: source.image,
					name: source.name,
					songsList: listSongsIds,
					source: source.source
				}
			})
		}
	}, [playlistSongs.length])

	return playChosenPlaylist
}
