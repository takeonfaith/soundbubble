export function findLenOfAuthors(authors) {
	let str = ""
	authors.forEach(el => {str += el.displayName})
	return str.length
}