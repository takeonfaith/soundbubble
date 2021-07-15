export function transformLyricsToArrayOfObjects(lyrics) {
	const arrayOfParagraphs = []
	let startSubstr = 0
	for (let i = 0; i < lyrics.length; i++) {
		if (lyrics[i] === '\n' || lyrics[i + 1] === undefined) {
			arrayOfParagraphs.push({
				startTime: 'undefined',
				text: lyrics.substr(startSubstr, i - startSubstr)
			})
			startSubstr = i + 1
		}
	}
	return arrayOfParagraphs
}