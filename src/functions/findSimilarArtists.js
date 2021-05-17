import { firestore } from "../firebase"

function findSimilarArtistsNames(authorsSongsArr, authorsData, setSimilarAuthors) {
	let peopleArray = []
	authorsSongsArr.forEach((song) => {
		let newAuthors = song.authors
		if (newAuthors.length !== 0) {
			peopleArray.push(newAuthors)
		}
	})
	peopleArray = peopleArray.flat()
	const uniqueAuthorsSet = new Set(peopleArray.map(people=>people.uid).filter(id=>id!==authorsData.uid))
	const uniqueAuthorsIdsArray = Array.from(uniqueAuthorsSet)
	const uniqueAuthorsDataArray = []
	for (let i = 0; i < uniqueAuthorsIdsArray.length; i++) {
		for (let j = 0; j < peopleArray.length; j++) {
			if(uniqueAuthorsIdsArray[i] === peopleArray[j].uid){
				uniqueAuthorsDataArray.push(peopleArray[j])
				break
			}
			
		}
	}
	return setSimilarAuthors(uniqueAuthorsDataArray)
}

export default async function findSimilarArtists(authorsData, setSimilarAuthors) {
	if (authorsData !== undefined && authorsData.ownSongs !== undefined && authorsData.ownSongs.length !== 0) {
		const authorsSongsArray = []
		const response = firestore.collection("songs").where("id", "in", authorsData.ownSongs)
		const data = await response.get();
		data.docs.forEach(item => {
			authorsSongsArray.push(item.data())
		})
		return findSimilarArtistsNames(authorsSongsArray, authorsData, setSimilarAuthors)
	}
}


