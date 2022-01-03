import { useEffect, useState } from 'react'
import { firestore } from '../../../firebase'

const useUserOnline = (userUID) => {
	const [isOnline, setIsOnline] = useState(false)
	useEffect(() => {
		const unsubscribe = firestore.collection('users').doc(userUID)
			.onSnapshot(doc => {
				if (userUID !== undefined) {
					const fiveMinutesAgo = new Date().getTime() - 300000
					const isOnline = doc.data().online > fiveMinutesAgo
					setIsOnline(isOnline)
				}
			})
		return () => {
			unsubscribe()
		}
	}, [userUID])

	return isOnline
}

export default useUserOnline
