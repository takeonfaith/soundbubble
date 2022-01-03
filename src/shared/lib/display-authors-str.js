import getShortString from "./get-short-string"


const displayAuthorsStr = (authorslist, separator = ' & ', lenLimit = 100) => {
	const authorsString = authorslist?.map(author => author.displayName).join(separator)
	return authorsString ? getShortString(authorsString, lenLimit) : ""
}

export default displayAuthorsStr