import { CHAT_ROUTE, HISTORY_ROUTE, HOME_ROUTE, LIBRARY_ROUTE, LOGIN_ROUTE, NOTFOUND_ROUTE, SEARCH_ROUTE, SIGNUP_ROUTE, TEMPLATE_ALBUM, TEMPLATE_AUTHOR, TEMPLATE_CHAT } from "./utils/consts";
import {LogInPage} from './pages/LogInPage'
import {SignUpPage} from './pages/SignUpPage'
import { Home } from "./pages/Home";
import { SearchPage } from "./pages/SearchPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ChatPage } from "./pages/ChatPage";
import { PageNotFound } from "./pages/PageNotFound";
import { DialoguePage } from "./pages/DialoguePage";
import { AlbumPage } from "./pages/AlbumPage";
import { AuthorPage } from "./pages/AuthorPage";
import { HistoryPage } from "./pages/HistoryPage";
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
	},
	{
		path:NOTFOUND_ROUTE,
		Component:PageNotFound
	},
	{
		path:TEMPLATE_CHAT,
		Component:DialoguePage
	},
	{
		path:TEMPLATE_ALBUM,
		Component:AlbumPage
	},
	{
		path:TEMPLATE_AUTHOR,
		Component:AuthorPage
	},
	{
		path:HISTORY_ROUTE,
		Component:HistoryPage
	}
]