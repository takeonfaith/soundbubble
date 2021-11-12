export function transformLyricsToArrayOfObjects(lyrics) {
	const arrayOfParagraphs = []
	let startSubstr = 0
	const fixedLyrics = lyrics + ' '
	for (let i = 0; i < fixedLyrics.length; i++) {
		if (fixedLyrics[i] === '\n' || fixedLyrics[i + 1] === undefined) {
			arrayOfParagraphs.push({
				startTime: 'undefined',
				text: fixedLyrics.substr(startSubstr, i - startSubstr)
			})
			startSubstr = i + 1
		}
	}
	return arrayOfParagraphs
}