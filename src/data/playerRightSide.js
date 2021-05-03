import { Share } from '../components/FullScreenPlayer/Share';
import { Options } from '../components/FullScreenPlayer/Options';
import { Lyrics } from '../components/FullScreenPlayer/Lyrics';
import { Queue } from '../components/FullScreenPlayer/Queue';
import { BiDotsVerticalRounded, BiShare } from 'react-icons/bi';
import {RiPlayListFill} from 'react-icons/ri'
import {FiAlignLeft} from 'react-icons/fi'
import { TiDocumentText } from 'react-icons/ti';
export const rightSide = [
	{
		id:0, 
		icon:<BiShare/>,
		component:Share
	},
	{
		id:1, 
		icon:<BiDotsVerticalRounded/>,
		component:Options
	},
	{
		id:2, 
		icon:<TiDocumentText/>,
		component:Lyrics
	},
	{
		id:3, 
		icon:<RiPlayListFill/>,
		component:Queue
	},
]