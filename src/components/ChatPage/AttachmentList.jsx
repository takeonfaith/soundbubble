import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase'
import { LoadingCircle } from '../Loading/LoadingCircle'
import { SongList } from '../Lists/SongList'
import { AuthorsList } from '../Basic/AuthorsList'
import { AlbumList } from '../Lists/AlbumList'
import { Slider } from '../Tools/Slider'
export const AttachmentList = ({ chatId }) => {
	const [attachmentList, setAttachmentList] = useState([])
	const [loading, setLoading] = useState(true)
	const [sliderCurrentPage, setSliderCurrentPage] = useState(0)
	const attachmentContent = [
		<SongList listOfSongs={attachmentList} source={{ source: `/chat/${chatId}`, name: `Chat with ${chatId}`, image: "", songsList: attachmentList }} />,
		<AuthorsList listOfAuthors={attachmentList} />,
		<AlbumList listOfAlbums={attachmentList} loading={loading} />
	]
	async function fetchAttachedData(attachedType, firebaseCollection) {
		
		const chatData = await firestore.collection('chats').doc(chatId).get()
		chatData.data().messages.forEach(message => {
			if (message[attachedType].length > 0) {
				message[attachedType].forEach(async itemId => {
					firestore.collection(firebaseCollection).doc(itemId).get().then(songData=>{
						setAttachmentList(prev => [...prev, songData.data()])
					})
					
				})
			}
		})
	}

	useEffect(() => {
		switch (sliderCurrentPage) {
			case 0:
				fetchAttachedData('attachedSongs', 'songs').then(()=>setLoading(false))
				break;
			case 1:
				fetchAttachedData('attachedAuthors', 'users').then(()=>setLoading(false))
				break;
			case 2:
				fetchAttachedData('attachedAlbums', 'playlists').then(()=>setLoading(false))
				break;
			default:
				break;
		}
	}, [sliderCurrentPage])

	useEffect(() => {
		setAttachmentList([])
	}, [chatId])

	console.log(attachmentList)

	return (
		<div className="AttachmentList">
			<Slider pages={["Songs", "Authors", "Playlists"]} currentPage={sliderCurrentPage} setCurrentPage={(page)=>{setSliderCurrentPage(page); setLoading(true); setAttachmentList([])}} />
			{loading ? <LoadingCircle /> :
				attachmentList.length > 0 ? attachmentContent[sliderCurrentPage] : <h2>Nothing here</h2>
			}

		</div>
	)
}
