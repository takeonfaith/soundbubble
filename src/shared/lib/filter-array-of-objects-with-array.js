const filterArrayOfObjectsWithArray = (whatToFilter, withWhatToFilter, filterParametr = 'uid', isInverted = true) => {
	return isInverted ? whatToFilter.filter(
		(item) => !withWhatToFilter.includes(item[filterParametr])
	) : whatToFilter.filter(
		(item) => withWhatToFilter.includes(item[filterParametr])
	)
}

export default filterArrayOfObjectsWithArray;