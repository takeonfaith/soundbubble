import { useEffect, useRef } from 'react'
import { useSong } from '../../../../contexts/song'
import { firestore } from '../../../../firebase'

export const useUpdateListenCount = () => {
	let listenCountTimeOut = useRef()
	const { currentSongData, currentSongPlaylistSource, songDuration, play } = useSong()
	function updateListenCount() {
		if (currentSongData.id !== -1) {
			listenCountTimeOut.current = setTimeout(async () => {
				let listens = (await firestore.collection('songs').doc(currentSongData.id).get()).data().listens
				++listens
				firestore.collection('songs').doc(currentSongData.id).update({
					listens: listens
				})

				//update playlist listens
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

				//update authors' listens
				currentSongData.authors.forEach(async author => {
					let authorNumberOfListenersPerMonth = (await firestore.collection('users').doc(author.uid).get()).data().numberOfListenersPerMonth
					++authorNumberOfListenersPerMonth
					firestore.collection('users').doc(author.uid).update({
						numberOfListenersPerMonth: authorNumberOfListenersPerMonth
					})
				})
			}, songDuration * 1000 * 0.5)
		}
	}

	useEffect(() => {
		clearTimeout(listenCountTimeOut.current)
		if (play) {
			updateListenCount()
		}
	}, [play, currentSongData.id, songDuration])

	return updateListenCount
}
