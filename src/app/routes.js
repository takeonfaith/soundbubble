import { CHAT_ROUTE, HISTORY_ROUTE, HOME_ROUTE, LIBRARY_ROUTE, LOGIN_ROUTE, NOTFOUND_ROUTE, SEARCH_ROUTE, SIGNUP_ROUTE, TEMPLATE_ALBUM, TEMPLATE_AUTHOR, TEMPLATE_CHAT, SETTINGS_ROUTE, LYRICS_EDITING_ROUTE } from "../shared/data/consts";
import { LibraryPage, ChatPage, PageNotFound, AlbumPage, DialoguePage, AuthorPage, LogInPage, HomePage, SearchPage, HistoryPage, SettingsPage, SignUpPage, LyricsEditingPage } from "../pages";
export const publicRoutes = [
	{
		path: LOGIN_ROUTE,
		Component: LogInPage,
	},
	{
		path: SIGNUP_ROUTE,
		Component: SignUpPage,
	}
]

export const privateRoutes = [
	{
		path: HOME_ROUTE,
		Component: HomePage,
	},
	{
		path: LIBRARY_ROUTE,
		Component: LibraryPage,
	},
	{
		path: SEARCH_ROUTE,
		Component: SearchPage,
	},
	{
		path: CHAT_ROUTE,
		Component: ChatPage,
	},
	{
		path: NOTFOUND_ROUTE,
		Component: PageNotFound
	},
	{
		path: TEMPLATE_CHAT,
		Component: DialoguePage
	},
	{
		path: TEMPLATE_ALBUM,
		Component: AlbumPage
	},
	{
		path: TEMPLATE_AUTHOR,
		Component: AuthorPage
	},
	{
		path: HISTORY_ROUTE,
		Component: HistoryPage
	},
	{
		path: SETTINGS_ROUTE,
		Component: SettingsPage
	},
	{
		path: LYRICS_EDITING_ROUTE,
		Component: LyricsEditingPage
	}
]