import { BiDotsVerticalRounded, BiShare } from 'react-icons/bi';
import { RiPlayListFill } from 'react-icons/ri';
import { TiDocumentText } from 'react-icons/ti';
import { SongInfo } from '../../features/song/ui/organisms/song-info';
import { AuthorsList } from '../../features/author/ui/templates/authors-list';
import { AddToPlaylists } from '../../features/full-screen-player/ui/molecules/add-to-playlists';
import { Options } from '../../features/full-screen-player/ui/organisms/options';
import { Queue } from '../../features/full-screen-player/ui/organisms/queue';
import { Share } from '../../features/full-screen-player/ui/organisms/share';
import { Lyrics } from '../../features/full-screen-player/ui/organisms/lyrics';


export const rightSide = [
	{
		id: 0,
		icon: <BiShare />,
		title: 'Share',
		component: Share
	},
	{
		id: 1,
		icon: <BiDotsVerticalRounded />,
		title: 'More',
		component: Options
	},
	{
		id: 2,
		icon: <TiDocumentText />,
		title: 'Lyrics',
		component: Lyrics
	},
	{
		id: 3,
		icon: <RiPlayListFill />,
		title: 'Queue',
		component: Queue
	},
	{
		id: 4,
		icon: null,
		title: 'Go To Authors',
		component: AuthorsList
	},
	{
		id: 5,
		icon: null,
		title: 'Add to playlist',
		component: AddToPlaylists
	},
	{
		id: 6,
		icon: null,
		title: 'Info',
		component: SongInfo
	},
]