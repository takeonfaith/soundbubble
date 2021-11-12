export const findVisiblePlaylists = (screenWidth) => {
	if(screenWidth < 1990 && screenWidth >= 1780) return 7
	else if(screenWidth < 1780 && screenWidth >= 1570) return 6
	else if(screenWidth < 1570 && screenWidth >= 1360) return 5
	else if(screenWidth < 1360 && screenWidth >= 1150) return 4
	else if(screenWidth < 1150 && screenWidth >= 1000) return 3
	else if(screenWidth < 1000 && screenWidth >= 892) return 6
	else if(screenWidth < 892 && screenWidth >= 754) return 5
	else if(screenWidth < 754 && screenWidth >= 614) return 4
	else if(screenWidth < 614 && screenWidth >= 464) return 3
	else return 2
}