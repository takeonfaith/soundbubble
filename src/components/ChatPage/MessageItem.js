import React from 'react'
import { AiFillFire, AiFillLike } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import { authors } from '../../data/authors'
import { chat } from '../../data/chat'
import { playlists } from '../../data/playlists'
import { songs } from '../../data/songs'
import displayDate from '../../functions/displayDate'
import { AuthorItemBig } from '../AuthorPage/AuthorItemBig'
import { PlaylistItem } from '../AuthorPage/PlaylistItem'
import { SongItem } from '../FullScreenPlayer/SongItem'

export const MessageItem = ({ messageData, chatId, scrollToMessageRef, setScrollToMessageId, scrollToMessageId }) => {
	const {message, attachedAlbums, attachedSongs, attachedAuthors, sender, inResponseToMessage, id, sentTime} = messageData
	const image = authors[sender].image
	function findWhatToWriteInResponseToItem(referedMessage){
		return referedMessage.attachedSongs.length ? "Audio":
		referedMessage.attachedAlbums.length? "Album":
		referedMessage.attachedAuthors.length?"Author":""
	}
	const emojis = [<FcLike />,<AiFillFire/>, <AiFillLike />]
	return (
		<div className={"MessageItem " + (sender === 30?'your':'')}  ref = {id === scrollToMessageId?scrollToMessageRef:null}>
			<div className = "messageItemImage">
				<img src={image} alt=""/>
			</div>
			<div className="messageItemBody" style = {id === scrollToMessageId?{animation:'showResponseMessage .5s forwards'}:{}}>	
				{inResponseToMessage !== null?
					<div className = "responseItem" onClick = {()=>setScrollToMessageId(inResponseToMessage)}>
						<h5>{authors[chat[chatId].messages[inResponseToMessage].sender].name}</h5>
						<p>
							{emojis[chat[chatId].messages[inResponseToMessage].message]}
							<span style = {{marginLeft:'5px', color:'var(--reallyLightBlue)'}}>
								{findWhatToWriteInResponseToItem(chat[chatId].messages[inResponseToMessage])}
							</span>
						</p> 
					</div>:null
				}
				<div>	
					<p>{emojis[message]}</p>
					{attachedSongs.map((songId, index) => {
						let song = songs['allSongs'][songId]
						return <SongItem song={song} localIndex={index} key={index} />
					})}
					{attachedAlbums.map((albumId, index) => {
						let album = playlists['allPlaylists'][albumId]
						return <PlaylistItem playlist={album} key={index} />
					})}
					{attachedAuthors.map((authorId, index) => {
						let author = authors[authorId]
						return <AuthorItemBig data={author} key={index} />
					})}
				</div>
				<div style = {{width:'100%', display:'flex', justifyContent:'flex-end', fontSize:'.7em', opacity:'.8'}}>{displayDate(sentTime, 2)}</div>
			</div>
		</div>
	)
}
