import { CHAT_ROUTE, HOME_ROUTE, LIBRARY_ROUTE, LOGIN_ROUTE, SEARCH_ROUTE, SIGNUP_ROUTE } from "./utils/consts";
import {LogInPage} from './pages/LogInPage'
import {SignUpPage} from './pages/SignUpPage'
import { Home } from "./pages/Home";
import { SearchPage } from "./pages/SearchPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ChatPage } from "./pages/ChatPage";
export const publicRoutes = [
	{
		path:LOGIN_ROUTE,
		Component:LogInPage,
	},
	{
		path:SIGNUP_ROUTE,
		Component:SignUpPage,
	}
]

export const privateRoutes = [
	{
		path:HOME_ROUTE,
		Component:Home,
	},
	{
		path:LIBRARY_ROUTE,
		Component:LibraryPage,
	},
	{
		path:SEARCH_ROUTE,
		Component:SearchPage,
	},
	{
		path:CHAT_ROUTE,
		Component:ChatPage,
	}
]