import { BiMusic, BiSearch } from "react-icons/bi";
import { FiHome, FiMessageCircle } from "react-icons/fi";
import { CHAT_ROUTE, HOME_ROUTE, LIBRARY_ROUTE, SEARCH_ROUTE } from "../utils/consts";

export const leftSideBar = [
	{
		id:0, 
		icon:<FiHome/>,
		title:'Home',
		link:HOME_ROUTE
	},
	{
		id:1, 
		icon:<BiMusic/>,
		title:'Library',
		link:LIBRARY_ROUTE
	},
	{
		id:2, 
		icon:<BiSearch/>,
		title:'Search',
		link:SEARCH_ROUTE
	},
	{
		id:3, 
		icon:<FiMessageCircle/>,
		title:'Chat',
		link:CHAT_ROUTE
	},

]