import { firestore } from "../../firebase"

export const addOrDeleteSongToPlaylist = (e, playlistId, song, yourPlaylists) => {
	if (yourPlaylists[e.target.id].songs.includes(song.id)) {
		const newSongsList = yourPlaylists[e.target.id].songs.filter(songNum => songNum !== song.id)
		yourPlaylists[e.target.id].songs = newSongsList
		firestore.collection('playlists').doc(playlistId).update({
			songs: newSongsList
		})
		return
	}
	const newSongsList = yourPlaylists[e.target.id].songs
	newSongsList.unshift(song.id)
	yourPlaylists[e.target.id].songs = newSongsList
	firestore.collection('playlists').doc(playlistId).update({
		songs: newSongsList
	})
}