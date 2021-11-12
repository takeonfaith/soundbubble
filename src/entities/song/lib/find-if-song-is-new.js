export default function findIfSongIsNew(song){
	const songReleaseDate = new Date(song.releaseDate)
	//1 814 400 000 - 3 weeks
	if((new Date().getTime() - songReleaseDate.getTime()) < 1814400000) return true

	return false
}