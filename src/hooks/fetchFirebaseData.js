import { useEffect } from 'react'
import { firestore } from '../firebase'

export const useFetchFirebaseData = (setLoading, collection, list, setState, sortCondition, whereCondFP, whereCondSP, whereCondTP, deps = []) => {

	async function fetchData() {
		const tempArray = []
		if (list === undefined) {
			if (whereCondFP !== undefined) {
				const items = await firestore.collection(collection).where(whereCondFP, whereCondSP, whereCondTP).get()
				items.docs.forEach(itemData => {
					tempArray.push(itemData.data())
				})
			}
			else{
				
				const items = await firestore.collection(collection).get()
				items.docs.forEach(itemData => {
					tempArray.push(itemData.data())
					
				})
			}
		}
		else {
			await list.forEach(async (itemId, index) => {
				const itemData = (await firestore.collection(collection).doc(itemId).get()).data()
				tempArray.push(itemData)
				if(index === list.length - 1){
					if(sortCondition !== undefined){
						tempArray.sort(sortCondition)
						setState(tempArray)

					}
					else {
						setState(tempArray)
						
					}
					
				}
				
			})
			setLoading(false)
		}
		return tempArray
	}
	useEffect(() => {
		setLoading(true)
		setState([])
		fetchData().then((res)=>{
			if(list === undefined) {
				setState(res)
				setLoading(false)
			}
		})
	}, deps)
}
