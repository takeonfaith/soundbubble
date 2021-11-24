import { useEffect, useState } from 'react'
import { firestore } from '../../../../firebase'

const useChat = (chatData) => {
	const [participantsData, setParticipantsData] = useState({})
	const [attachedData, setAttachedData] = useState({ "songs": {}, "playlists": {}, "users": {} })

	const fetchParticipants = () => {
		const tempArray = chatData.participants.map(async (itemId) => {
			return (await firestore.collection('users').doc(itemId).get()).data()
		})

		Promise.all(tempArray).then((res) => {
			const tempObj = {}

			res.forEach((el) => {
				tempObj[el.uid] = el
			})

			setParticipantsData(tempObj)
		})
	}

	const fetchAttachedItems = (list, place) => {
		list.forEach(async (itemId) => {
			let itemData = await firestore.collection(place).doc(itemId).get();
			if (itemData.exists) setAttachedData((prev) => {
				const temp = prev
				temp[place][itemData.data()?.id ?? itemData.data()?.uid] = itemData.data()
				return { ...temp }
			});
			else setAttachedData((prev) => {
				const temp = prev
				temp[itemData.data()?.id ?? itemData.data()?.uid] = null
				return { ...temp }
			});
		})
	}

	const fetchAllAttached = () => {
		chatData.messages.forEach((message) => {
			fetchAttachedItems(message.attachedSongs, 'songs')
			fetchAttachedItems(message.attachedAlbums, 'playlists')
			fetchAttachedItems(message.attachedAuthors, 'users')
		});
	}

	useEffect(() => {
		fetchParticipants()
		fetchAllAttached()
	}, [])

	return { participantsData, attachedData }
}

export default useChat
