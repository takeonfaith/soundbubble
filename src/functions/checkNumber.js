export default function checkNumber(number, max, min = 0){
	if(number > max) return min
	if(number < min) return max

	return number
}