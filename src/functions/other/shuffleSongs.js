export default function shuffleSongs(songsArray){
	const randomIndexesArray = []
	const newSongsNumbersArray = new Array(songsArray.length)
	let counter = 0
	while(counter < songsArray.length){
		const randNum = Math.floor(Math.random()*(songsArray.length))
		if(!randomIndexesArray.includes(randNum)){
			randomIndexesArray.push(randNum)
			newSongsNumbersArray[randNum] = songsArray[counter]
			counter++
		}
	}
	return newSongsNumbersArray
}