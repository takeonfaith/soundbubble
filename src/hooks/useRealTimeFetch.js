import React, { useEffect } from 'react'

export const useRealTimeFetch = (currentUser, fetchFunc, changeCondition, dep) => {
	useEffect(() => {
		if(currentUser.uid){
			let shouldChangeYourPlaylists = changeCondition
			if (shouldChangeYourPlaylists) {
				fetchFunc()
			}
		}
	}, dep)
}
