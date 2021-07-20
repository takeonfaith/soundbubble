import React, { useState } from 'react'
import { useEffect } from 'react'
import { BackBtn } from '../components/Buttons/BackBtn'
import { SongList } from '../components/Lists/SongList'
import { useAuth } from '../contexts/AuthContext'
import { firestore } from '../firebase'
import { fetchItemsList } from '../functions/fetch/fetchItemsList'

export const HistoryPage = () => {
	const [historySongsIds, setHistorySongsIds] = useState([])
	const [historySongs, setHistorySongs] = useState([])
	const { currentUser } = useAuth()
	useEffect(() => {
		firestore.collection('history').doc(currentUser.uid).onSnapshot(res => {
			setHistorySongsIds(res.data().history)
		})
	}, [firestore])

	useEffect(() => {
		fetchItemsList(historySongsIds, "songs", setHistorySongs)
	}, [historySongsIds])
	return (
		<div className="HistoryPage" style={{ animation: 'zoomIn .2s forwards' }}>
			<div style = {{display:'flex', alignItems:'center'}}>
				<BackBtn/>
				<h2 style={{ margin: '0px', marginLeft:'8px' }}>History</h2>
			</div>
			<SongList listOfSongs={historySongs} source={{ source: `/history`, name: "History", image: "https://www.seekpng.com/png/full/781-7815113_history-icon-white-png.png", songsList: historySongs }} showCount showSearch displayIfEmpty={"Nothing here"} />
		</div>
	)
}
