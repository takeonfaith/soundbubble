export default function createRandomId(len = 10) {
	let str = ""
	for (let i = 0; i < len; i++) {
		let randNum = Math.floor(Math.random() * 10)
		str += randNum
	}
	return str
}