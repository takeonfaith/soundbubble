import shortWord from "../other/shortWord"

export const displayAuthorsStr = (authorslist, separator = ' & ', lenLimit = 100) =>{
	const authorsString = authorslist?.map(author=>author.displayName).join(separator)
	return authorsString?shortWord(authorsString, lenLimit):""
}