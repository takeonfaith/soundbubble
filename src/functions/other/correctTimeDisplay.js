function amountOfZeros(number) {
	return number % 10 === number ? "0" + number : number
}

export default function correctTimeDisplay(seconds) {
	return amountOfZeros(Math.floor(seconds / 60)) + ":" + amountOfZeros(Math.floor(seconds % 60))
}