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
	setSimilarAuthors(uniqueAuthorsDataArray)
	return uniqueAuthorsDataArray
}

export default async function findSimilarArtists(authorsData, setSimilarAuthors) {
	if (authorsData !== undefined && authorsData.ownSongs !== undefined && authorsData.ownSongs.length !== 0) {
		const authorsSongsArray = []
		authorsData.ownSongs.forEach(async (songId, index)=>{
			const songData = (await firestore.collection('songs').doc(songId).get()).data()
			authorsSongsArray.push(songData)
			if(index === authorsData.ownSongs.length - 1){
				return findSimilarArtistsNames(authorsSongsArray, authorsData, setSimilarAuthors)
			}
		})


	}
}


