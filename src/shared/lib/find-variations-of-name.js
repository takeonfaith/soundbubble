import normalizeString from "./normalize-string"

export const findVariationsOfName = (name) => {
	let variantsOfName = []
	let personName = normalizeString(name)
	for (let i = 1; i < personName.length + 1; i++) {
		variantsOfName.push(personName.substr(0, i))
	}
	return variantsOfName
}