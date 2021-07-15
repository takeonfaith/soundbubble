import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase'
import displayDate from '../../functions/display/displayDate'

export const LastSeen = ({userUID}) => {
	const [lastSeen, setLastSeen] = useState("")
	const [isOnline, setIsOnline] = useState(false)
	useEffect(() => {
		const unsubscribe = firestore.collection('users').doc(userUID)
		.onSnapshot(doc => {
			if(userUID !== undefined){
				const fiveMinutesAgo = new Date().getTime() - 300000
				const isOnline = doc.data().online > fiveMinutesAgo
				setIsOnline(isOnline)
				if(doc.data().online === undefined) setLastSeen("offline")
				else if(!isOnline) setLastSeen("last seen " + displayDate(doc.data().online, 3))
			}
		 })
		return () => {
			unsubscribe()
		}
	}, [firestore, userUID])
	return (
		isOnline?<span>Online</span>:<span>{lastSeen}</span>
	)
}
