export default function normalizeString(str){
	return str.replace(/\s/g, '-').toLowerCase()
}