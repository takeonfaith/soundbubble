import { useEffect } from 'react';
import { useSong } from '../contexts/SongContext';
import displayAuthorsStr from '../functions/display/displayAuthorsStr';


export const useMediaMetadata = () => {
	const { currentSongData, currentSongPlaylistSource, nextSong, prevSong, songRef, setPlay } = useSong()

	const updatePositionState = () => {
		navigator.mediaSession.setPositionState({
			duration: songRef.current.duration,
			playbackRate: songRef.current.playbackRate,
			position: songRef.current.currentTime
		});
	}

	function playSong() {
		songRef.current.play()
		setPlay(true)
	}

	function pauseSong() {
		songRef.current.pause()
		setPlay(false)
	}

	useEffect(() => {
		if ('mediaSession' in navigator && currentSongData.id !== -1) {
			navigator.mediaSession.metadata = new window.MediaMetadata({
				title: currentSongData.name,
				artist: displayAuthorsStr(currentSongData.authors),
				album: currentSongPlaylistSource.name,
				artwork: [
					{ src: currentSongData.cover, sizes: '512x512', type: 'image/png' },
				]
			});

			navigator.mediaSession.setActionHandler('play', () => { playSong(); });
			navigator.mediaSession.setActionHandler('pause', pauseSong);
			navigator.mediaSession.setActionHandler('stop', pauseSong);
			navigator.mediaSession.setActionHandler('nexttrack', () => { nextSong(); updatePositionState() });
			navigator.mediaSession.setActionHandler('previoustrack', () => { prevSong(); updatePositionState() })
		}
	}, [currentSongData.id])
}
