export default function filterArrayWithArray(whatToFilter, withWhatToFilter){
	return whatToFilter.filter(
		function (e) {
			return this.indexOf(e) < 0;
		},
		withWhatToFilter
	);
}