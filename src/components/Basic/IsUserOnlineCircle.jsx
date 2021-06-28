import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase'

export const IsUserOnlineCircle = ({userUID}) => {
	const [isOnline, setIsOnline] = useState(false)
	useEffect(() => {
		const unsubscribe = firestore.collection('users').doc(userUID)
		.onSnapshot(doc => {
			if(userUID !== undefined){
				const fiveMinutesAgo = new Date().getTime() - 300000
				const isOnline = doc.data().online > fiveMinutesAgo
				setIsOnline(isOnline)
			}
		 })
		return () => {
			unsubscribe()
		}
	}, [firestore, userUID])
	return (
		isOnline?<div className = "onlineCircle"></div>:null
	)
}
