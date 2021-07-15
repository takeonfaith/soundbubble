import React, { useEffect, useState } from 'react'
import { firestore } from '../firebase'

export const useAlbumAuthors = (data) => {
	const [albumAuthors, setAlbumAuthors] = useState([])
	const [authorsImages, setAuthorsImages] = useState([])
	async function fetchAuthorsData() {
		if (data?.authors !== undefined) {
			const ids = data.authors.map(author => author.uid)
			const authrorsData = await firestore.collection("users").where("uid", "in", ids).get()
			const tempArrayAuthors = []
			const tempArrayImages = []
			authrorsData.docs.forEach((a) => {
				tempArrayAuthors.push(a.data())
				tempArrayImages.push(a.data().photoURL)
			})
			setAlbumAuthors(tempArrayAuthors)
			setAuthorsImages(tempArrayImages)
		}
	}
	useEffect(() => {
		fetchAuthorsData()
	}, [data?.id])

	return [albumAuthors, authorsImages]
}
