export default function rightFormanForBigNumber(number){
	if(number < 1000) return number

	if(number < 1000000) return parseFloat(number/1000).toFixed(1) + 'K'

	if(number < 1000000000) return parseFloat(number / 1000000).toFixed(1) + 'M'
}