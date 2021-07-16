import { firestore } from "../../firebase"

export const fetchItemsList = (list, collection, setList, resManipulation = (res) => res, lastFunc = () => null, lengthRestrict, assignMode = 0) => {
	if (list?.length) {
		const tempArray = list.map(async (itemId, i) => {
			return (await firestore.collection(collection).doc(itemId).get()).data()
		})
		Promise.all(tempArray).then(res => {
			let finalResult = resManipulation(res)
			if(finalResult?.length > lengthRestrict) finalResult.length = lengthRestrict
			if(assignMode === 0) setList(finalResult)
			else setList(prev=>{
				let temp = []
				finalResult.forEach(item=>{
					if(!prev.find(el=>el.uid === item['uid' || 'id'])){
						temp.push(item)
					}
				})
				return [...prev, ...temp]
			})
			lastFunc()
		})
	}
}