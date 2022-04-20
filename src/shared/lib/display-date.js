
function amountOfZeros(number) {
	return number % 10 === number ? "0" + number : number
}

function toDateTime(secs) {
	var t = new Date(1970, 0, 1); // Epoch
	t.setSeconds(secs);
	return t;
}

export default function displayDate(stringDate, displayMode = 0) {
	const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	let newDate = !isNaN(stringDate) ? stringDate.seconds ? toDateTime(stringDate.seconds + 10800) : toDateTime((stringDate / 1000) + 10800) : new Date(stringDate)

	if (displayMode === 0) {
		return Months[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear()
	}

	if (displayMode === 1) {
		return Months[newDate.getMonth()] + " " + newDate.getDate()
	}

	if (displayMode === 2) {
		return amountOfZeros(newDate.getHours()) + ":" + amountOfZeros(newDate.getMinutes())
	}

	if (displayMode === 3) {
		return Months[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear() + " at " + amountOfZeros(newDate.getHours()) + ":" + amountOfZeros(newDate.getMinutes())
	}
}