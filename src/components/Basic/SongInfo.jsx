import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useSong } from '../../contexts/SongContext'
import displayDate from '../../functions/display/displayDate'
import {CgMusicNote} from 'react-icons/cg'
import {PersonTinyVerticalItem} from '../AuthorPage/PersonTinyVerticalItem'
import { useModal } from '../../contexts/ModalContext'
import { FriendsListToShareWith } from './FriendsListToShareWith'
import { LoadingCircle } from '../Loading/LoadingCircle'
export const SongInfo = ({song}) => {
	const {currentSongData} = useSong()
	const {setContent} = useModal()
	const {currentUser} = useAuth()
	const [songData, setSongData] = useState(song || currentSongData)
	const {displayAuthors, yourFriends} = useSong()
	const [friendsThatHaveThisSong, setFriendsThatHaveThisSong] = useState([])
	const [loading, setLoading] = useState(true)
	async function findFriendsThatHaveThisSong(){
		setLoading(true)
		setFriendsThatHaveThisSong([])
		yourFriends.forEach(friend=>{
			if(friend.addedSongs.includes(songData.id)) setFriendsThatHaveThisSong(prev=>[...prev, friend])
		})
		setLoading(false)
	}

	useEffect(() => {
		if(song !== undefined) setSongData(song)
	}, [song && song.id])

	useEffect(() => {
		findFriendsThatHaveThisSong()
	}, [songData.id])

	return (
		<div className = 'SongInfo'>
			<div className="songImage" style={{ backgroundImage: `url(${songData.cover})` }}></div>
			<div className = "songInfoContent">
				<h3 style = {{color:songData.imageColors[0]}}>{songData.name}</h3>
				<span>{displayAuthors(songData.authors, ', ')}</span>
				<div style = {{display:'flex', alignItems:'center', opacity:'0.6', fontSize:'.9em', position:"relative"}} className = "listensAndDate">
					<p className = "infoListens" style = {{marginRight:'15px', position:'relative'}}>{songData.listens} <CgMusicNote /></p>
					<span>{displayDate(songData.releaseDate)}</span>
				</div>
				<h4 style = {{margin:'10px 0'}}>{friendsThatHaveThisSong.length > 0? 'Friends that listen that song': 'None of your friends listens this'}</h4>
				{!loading?<div style = {{display:'flex', alignItems:'center'}}>
					{friendsThatHaveThisSong.length > 0?friendsThatHaveThisSong.map((person, index)=>{
						return <PersonTinyVerticalItem person = {person} key = {person.uid}/>
					}):<button className = "shareBtn" style = {{minHeight:'35px', background:songData.imageColors[0]}} onClick = {()=>{setContent(<FriendsListToShareWith item = {songData} whatToShare = {'song'}/>)}}>Share</button>}
				</div>:
				<div style = {{position:'relative', height:'50px'}}><LoadingCircle top = {"50%"}/></div>}
			</div>
		</div>
	)
}
