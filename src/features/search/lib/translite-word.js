const transliteWord = (word) => {
	const dictionaryRuToEn = {
		'а': 'f', 'б': ',', 'в': 'd', 'г': 'u', 'д': 'l', 'е': 't', 'ё': '`', 'ж': ';',

		'з': 'p', 'и': 'b', 'й': 'q', 'к': 'r', 'л': 'k', 'м': 'v', 'н': 'y',

		'о': 'j', 'п': 'g', 'р': 'h', 'с': 'c', 'т': 'n', 'у': 'e', 'ф': 'a', 'х': '[',

		'ц': 'w', 'ч': 'x', 'ш': 'i', 'щ': 'o', 'ъ': ']', 'ы': 's', 'ь': 'm', 'э': '\'', 'ю': '.', 'я': 'z'
	}

	const dictionaryEnToRu = {
		'f': 'а', ',': 'б', 'd': 'в', 'u': 'г', 'l': 'д', 't': 'е', '`': 'ё', ';': 'ж',

		'p': 'з', 'b': 'и', 'q': 'й', 'r': 'к', 'k': 'л', 'v': 'м', 'y': 'н',

		'j': 'о', 'g': 'п', 'h': 'р', 'c': 'с', 'n': 'т', 'e': 'у', 'a': 'ф', '[': 'х',

		'w': 'ц', 'x': 'ч', 'i': 'ш', 'o': 'щ', ']': 'ъ', 's': 'ы', 'm': 'ь', '\'': 'э', '.': 'ю', 'z': 'я'
	}

	if (dictionaryRuToEn[word[0]])
		return word.split('').reduce((acc, letter) => acc + dictionaryRuToEn[letter], '')
	else return word.split('').reduce((acc, letter) => acc + dictionaryEnToRu[letter], '')

}

export default transliteWord