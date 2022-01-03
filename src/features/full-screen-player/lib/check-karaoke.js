export function checkKaraoke(lyrics) {
	if (lyrics !== undefined && lyrics.length === 0) return false

	if (lyrics !== undefined) {
		if (lyrics[0].startTime === 'undefined') return false
	}

	return true
}
