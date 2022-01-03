import { useEffect, useState } from 'react';
import { firestore } from '../../../../firebase';

const useCustomizeAlbum = (playlist) => {
	const [playlistName, setPlaylistName] = useState(playlist.name);
	const [error, setError] = useState("")
	const [playlistCover, setPlaylistCover] = useState(playlist.image);
	const [authorsInputValue, setAuthorsInputValue] = useState("");
	const [allAuthors, setAllAuthors] = useState([]);
	const [chosenAuthors, setChosenAuthors] = useState(playlist.authors);
	const [releaseDate, setReleaseDate] = useState(playlist.creationDate);
	const [songsSearch, setSongsSearch] = useState("");
	const [allSongs, setAllSongs] = useState([]);
	const [chosenSongs, setChosenSongs] = useState(playlist.songs);
	const [playlistStatus, setPlaylistStatus] = useState(
		playlist.isAlbum ? 1 : 0
	);
	const [isPlaylistPrivate, setIsPlaylistPrivate] = useState(
		playlist.isPrivate ? 1 : 0
	);
	const [loadingAuthors, setLoadingAuthors] = useState(false);
	const [loadingSongs, setLoadingSongs] = useState(false);
	const [imageLocalPath, setImageLocalPath] = useState("");
	const [imageColors, setImageColors] = useState(playlist.imageColors);
	const [loading, setLoading] = useState(false);
	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		setPlaylistName(playlist.name);
		setPlaylistCover(playlist.image);
		setChosenAuthors(playlist.authors);
	}, [playlist.id]);

	useEffect(() => {
		if (songsSearch.length === 0) {
			playlist.songs.map(async (songId) => {
				const songData = (
					await firestore.collection("songs").doc(songId).get()
				).data();
				setLoadingSongs(false);
				setAllSongs((prev) => [...prev, songData]);
			});
		}
	}, [songsSearch]);

	function removeAuthorFromList(data) {
		const filtered = chosenAuthors.filter((people) => people.uid !== data.uid);
		return setChosenAuthors(filtered);
	}

	function addAuthor(data) {
		if (!chosenAuthors.some((person) => person.uid === data.uid)) {
			return setChosenAuthors((prev) => [
				...prev,
				{
					uid: data.uid,
					displayName: data.displayName,
					photoURL: data.photoURL,
				},
			]);
		}

		removeAuthorFromList(data);
	}

	async function addPlaylistToFirebase(e) {
		e.preventDefault();
		if (!playlistName.length) setError("Playlist has to have a name")
		else if (!chosenAuthors.length) setError("Playlist has to have at least 1 author")
		else {
			if (chosenAuthors.length > playlist.authors.length) {
				const newAuthors = chosenAuthors.filter((author) => {
					return !playlist.authors.find((a) => a.uid === author.uid);
				});
				newAuthors.forEach(async (author) => {
					const authorRef = await firestore
						.collection("users")
						.doc(author.uid)
						.get();
					const authorData = authorRef.data();
					const authorPlaylists = authorData.ownPlaylists;
					authorPlaylists.push(playlist.id);
					firestore.collection("users").doc(author.uid).update({
						ownPlaylists: authorPlaylists,
					});
				});
			} else if (chosenAuthors.length < playlist.authors.length) {
				const newAuthors = playlist.authors.filter((author) => {
					return !chosenAuthors.find((a) => a.uid === author.uid);
				});
				newAuthors.forEach(async (author) => {
					const authorRef = await firestore
						.collection("users")
						.doc(author.uid)
						.get();
					const authorData = authorRef.data();
					const authorPlaylists = authorData.ownPlaylists;
					const filteredPlaylists = authorPlaylists.filter(
						(playlistId) => playlistId !== playlist.id
					);
					firestore.collection("users").doc(author.uid).update({
						ownPlaylists: filteredPlaylists,
					});
				});
			}

			firestore
				.collection("playlists")
				.doc(playlist.id)
				.update({
					id: playlist.id,
					name: playlistName,
					songs: chosenSongs,
					authors: chosenAuthors,
					image: playlistCover,
					listens: playlist.listens,
					creationDate: releaseDate,
					subscribers: playlist.subscribers,
					isAlbum: playlistStatus === 1,
					imageColors: imageColors,
					isPrivate: isPlaylistPrivate === 1,
				})
				.then(() => {
					setLoading(false);
					setCompleted(true);
				});
		}
	}

	return {
		imageLocalPath,
		setImageColors,
		playlistName,
		setPlaylistName,
		authorsInputValue,
		setAuthorsInputValue,
		setAllAuthors,
		chosenAuthors,
		removeAuthorFromList,
		loadingAuthors,
		allAuthors,
		addAuthor,
		songsSearch,
		setSongsSearch,
		setAllSongs,
		loadingSongs,
		allSongs,
		chosenSongs,
		setChosenSongs,
		setPlaylistStatus,
		playlistStatus,
		isPlaylistPrivate,
		setIsPlaylistPrivate,
		setPlaylistCover,
		releaseDate,
		setReleaseDate,
		setImageLocalPath,
		addPlaylistToFirebase,
		loading,
		completed,
		setCompleted,
		error,
		setError
	}
}

export default useCustomizeAlbum
