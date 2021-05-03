import { authors } from "../data/authors"
import { songs } from "../data/songs"

function setSimilarArtists(authorsNamesArr, setSimilarAuthors) {
	setSimilarAuthors(authors.filter(author => authorsNamesArr.includes(author.name)))
	return authors.filter(author => authorsNamesArr.includes(author.name))
}
function findSimilarArtistsNames(authorsSongsArr, artistName, setSimilarAuthors) {
	let tempArray = []
	authorsSongsArr.forEach((song) => {
		let newAuthor = song.authors.filter(author => { return author !== artistName && !tempArray.includes(author) })
		if (newAuthor.length !== 0) {

			tempArray.push(newAuthor)
		}
	})
	return setSimilarArtists(tempArray.flat(), setSimilarAuthors)
}

export default function findSimilarArtists(artistName, setSimilarAuthors) {
	let tempArray = []
	songs['allSongs'].forEach((song, i) => {
		if (song.authors.includes(artistName)) {
			tempArray.push(song)
		}
	})
	return findSimilarArtistsNames(tempArray, artistName, setSimilarAuthors)
}


