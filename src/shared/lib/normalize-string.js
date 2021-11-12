export default function normalizeString(str) {
	return str.replace(/\s/g, '').replace(/\$/g, "s").replace(/[,'._/]/g, '').replace(/-/g, '').toLowerCase()
}