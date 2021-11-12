import { useRef, useState } from 'react';
import { useAuth } from '../../../../contexts/auth';
import { useSong } from '../../../../contexts/song';
import saveSearchHistory from '../../../../features/search/lib/save-search-history';
import { firestore } from '../../../../firebase';

import useOutsideClick from '../../../../shared/lib/hooks/use-outside-click';
import { addSongToHistory } from '../add-song-to-history';

const useSongLogic = ({ song, position, localIndex, shouldSaveSearchHistory }) => {
	const {
		setCurrentSong,
		currentSong,
		play,
		songRef,
		setPlay,
		setCurrentSongInQueue,
	} = useSong();

	const [openMoreWindow, setOpenMoreWindow] = useState(false);
	const [
		moreWindowPosRelativeToViewport,
		setMoreWindowPosRelativeToViewport,
	] = useState(0);
	const currentItemRef = useRef(null);
	const { currentUser } = useAuth();

	useOutsideClick(currentItemRef, setOpenMoreWindow);

	function chooseSongItem() {
		setCurrentSong(song.id);
		firestore.collection("users").doc(currentUser.uid).update({
			lastSongPlayed: song.id,
		});

		setCurrentSongInQueue(localIndex);
		if (song.id === currentSong && play) {
			songRef.current.pause();
			setPlay(false);
			return;
		}

		songRef.current.play();
		setPlay(true);

		if (shouldSaveSearchHistory)
			saveSearchHistory(currentUser.uid, song.id, "songs");
		addSongToHistory(song.id, currentUser);
	}

	function openSongItemMoreWindow(e) {
		e.stopPropagation();
		setOpenMoreWindow(!openMoreWindow);
		setMoreWindowPosRelativeToViewport(
			position || e.target.getBoundingClientRect().top
		);
	}

	return { openSongItemMoreWindow, chooseSongItem, moreWindowPosRelativeToViewport, openMoreWindow, currentItemRef }
}

export default useSongLogic
