import { useEffect, useState } from 'react';
import { useModal } from '../../../../contexts/modal';
import { firestore } from '../../../../firebase';
import { transformLyricsToArrayOfObjects } from '../../../full-screen-player/lib/transform-lyrics-to-array-of-object';

const useEditSong = (song) => {

	const { toggleModal, openBottomMessage } = useModal();
	const [songName, setSongName] = useState(song.name);
	const [songAuthors, setSongAuthors] = useState(song.authors);
	const [songCover, setSongCover] = useState(song.cover);
	const [imageColors, setImageColors] = useState(song.imageColors);
	const [lyrics, setLyrics] = useState(
		song.lyrics.map((obj) => obj.text).join("\n")
	);
	const [foundAuthors, setFoundAuthors] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		setSongName(song.name);
		setSongAuthors(song.authors);
		setSongCover(song.cover);
		setImageColors(song.imageColors);
		setLyrics(song.lyrics.map((obj) => obj.text).join("\n"));
	}, [song.id]);

	function manuallyChangeColor(e, i) {
		imageColors[i] = e.target.value;
		setImageColors([...imageColors]);
	}

	useEffect(() => {
		if (errorMessage) openBottomMessage(errorMessage, 'failure')
	}, [errorMessage])

	function updateSong() {
		if (songName.length === 0) {
			setErrorMessage("Name shouldn't be empty");
		} else if (songAuthors.length === 0) {
			setErrorMessage("Song has to have at least 1 author");
		} else if (songCover.length === 0) {
			setErrorMessage("Song has to have cover");
		} else {
			setLoading(true);
			if (songAuthors.length > song.authors.length) {
				const newAuthors = songAuthors.filter((author) => {
					return !song.authors.find((a) => a.uid === author.uid);
				});
				newAuthors.forEach(async (author) => {
					const authorRef = await firestore
						.collection("users")
						.doc(author.uid)
						.get();
					const authorData = authorRef.data();
					const authorSongs = authorData.ownSongs;
					authorSongs.push(song.id);
					firestore.collection("users").doc(author.uid).update({
						ownSongs: authorSongs,
					});
				});
			} else if (songAuthors.length < song.authors.length) {
				const newAuthors = song.authors.filter((author) => {
					return !songAuthors.find((a) => a.uid === author.uid);
				});
				newAuthors.forEach(async (author) => {
					const authorRef = await firestore
						.collection("users")
						.doc(author.uid)
						.get();
					const authorData = authorRef.data();
					const authorSongs = authorData.ownSongs;
					const filteredSongs = authorSongs.filter(
						(songId) => songId !== song.id
					);
					firestore.collection("users").doc(author.uid).update({
						ownSongs: filteredSongs,
					});
				});
			}

			firestore
				.collection("songs")
				.doc(song.id)
				.update({
					name: songName,
					authors: songAuthors,
					image: songCover,
					imageColors: imageColors,
					lyrics: transformLyricsToArrayOfObjects(lyrics),
				})
				.then(() => {
					setLoading(false);
					setCompleted(true);
					toggleModal();
				});
		}
	}

	function removeAuthorFromList(data) {
		const filtered = songAuthors.filter((people) => people.uid !== data.uid);
		return setSongAuthors(filtered);
	}
	function addAuthor(data) {
		if (!songAuthors.some((person) => person.uid === data.uid)) {
			return setSongAuthors((prev) => [
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

	return {
		songCover,
		songName,
		setSongName,
		imageColors,
		manuallyChangeColor,
		searchValue,
		setSearchValue,
		foundAuthors,
		setFoundAuthors,
		songAuthors,
		removeAuthorFromList,
		addAuthor,
		lyrics,
		setLyrics,
		updateSong,
		loading,
		completed,
		setCompleted
	}
}

export default useEditSong
