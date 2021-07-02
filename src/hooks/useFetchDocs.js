import React, { useEffect } from 'react'
import { firestore } from '../firebase'

export const useFetchDocs = (setLoading, listOfItems, setList, deps) => {
	function fetchItem(){
		listOfItems.forEach(async itemId=>{
			const personData = (await firestore.collection('users').doc(itemId).get()).data()
			setList(prev=>[...prev, personData])
		})
		setLoading(false)
	}

	useEffect(() => {
		setLoading(true)
		fetchItem()
		return ()=>fetchItem()
	}, deps)
}
