
function amountOfZeros(number) {
	return number % 10 === number ? "0" + number : number
}

export default function displayDate(stringDate, displayMode = 0){
	const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	let newDate = new Date(stringDate)
	if(displayMode === 0){
		return Months[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear() 
	}

	if(displayMode === 1){
		return Months[newDate.getMonth()] + " " + newDate.getDate()
	}

	if(displayMode === 2){
		return amountOfZeros(newDate.getHours()) + ":" + amountOfZeros(newDate.getMinutes())
	}
}