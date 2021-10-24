import { useEffect } from 'react'

export const useConditionFunc = (currentUser, fetchFunc, changeCondition, dep) => {
	useEffect(() => {
		if (currentUser.uid) {
			if (changeCondition) {
				fetchFunc()
			}
		}
	}, [JSON.stringify(dep)])
}
