import shortWord from "../other/shortWord"

const displayAuthorsStr = (authorslist, separator = ' & ', lenLimit = 100) => {
	const authorsString = authorslist?.map(author => author.displayName).join(separator)
	return authorsString ? shortWord(authorsString, lenLimit) : ""
}

export default displayAuthorsStr