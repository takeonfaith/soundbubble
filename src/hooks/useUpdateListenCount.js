import React, { useEffect, useRef } from 'react'
import { useSong } from '../contexts/SongContext'
import { firestore } from '../firebase'

export const useUpdateListenCount = () => {
	let listenCountTimeOut = useRef()
	const {currentSongData, currentSongPlaylistSource, songDuration, play} = useSong()
	function updateListenCount() {
		if(currentSongData.id !== -1){
			listenCountTimeOut.current = setTimeout(() => {
				let listens = currentSongData.listens
				listens++
				firestore.collection('songs').doc(currentSongData.id).update({
					listens: listens
				})
				if (currentSongPlaylistSource.source.substr(1, 6) === 'albums') {
					const sourceId = currentSongPlaylistSource.source.substr(8, currentSongPlaylistSource.source.length - 8)
					firestore.collection('playlists').doc(sourceId).get().then((res) => {
						let listedData = res.data().listens
						listedData++
						firestore.collection('playlists').doc(sourceId).update({
							listens: listedData
						})
					})
				}
			}, songDuration * 1000 * 0.5)
		}
	}

	useEffect(() => {
		clearTimeout(listenCountTimeOut.current)
		if (play) {
			updateListenCount()
		}
	}, [play, currentSongData.id])

	return updateListenCount
}
