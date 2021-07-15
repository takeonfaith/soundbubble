export default function normalizeString(str){
	return str.replace(/\s/g, '').replace(/[,'._/]/g, '').replace(/-/g, '').toLowerCase()
}