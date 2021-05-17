import React, { useEffect, useState } from 'react'
import { ColorExtractor } from 'react-color-extractor'
import { FiHeadphones, FiMoreVertical, FiPlusCircle, FiUserPlus } from 'react-icons/fi'
import { ImCheckmark } from 'react-icons/im'
import { authors } from '../../data/authors'
import { useSong } from '../../functionality/SongPlay/SongContext'
import displayDate from '../../functions/displayDate'
import { BackBtn } from '../Basic/BackBtn'
import { SmallImages } from './SmallImages'
import {useAuth} from '../../functionality/AuthContext'
import {IoMdExit } from 'react-icons/io'
import { firestore } from '../../firebase'
export const Header = ({data, headerColors, setHeaderColors}) => {
	const {displayAuthors} = useSong()
	const [albumAuthors, setAlbumAuthors] = useState([])
	const [authorsImages, setAuthorsImages] = useState([])
	const {currentUser, logout} = useAuth()
	async function fetchAuthorsData() {
		if(data.authors !== undefined && !albumAuthors.length){
			const ids = data.authors.map(author=>author.uid)
			const response = firestore.collection("users").where("uid", "in", ids)
			const authrorsData = await response.get();
			console.log(authrorsData.docs)
			authrorsData.docs.forEach((a)=>{
				console.log(a.data())
				setAlbumAuthors(prev=>[...prev, a.data()])
				setAuthorsImages(prev=>[...prev, a.data().photoURL])
			})
		}
	}
	useEffect(() => {
		fetchAuthorsData()
	}, [data])

	function displayCreationDateIfExists(){
		return data.creationDate !== undefined?
			<div className = "headerListenersAndSubsItem">
				<span>{displayDate(data.creationDate)}</span>
			</div>:
			null
	}

	function isAlbumOrIsAuthor(){
		return data.authors !== undefined?data.isAlbum?<h5>Album</h5>:<h5>Playlist</h5>:data.isAuthor?<h5>Author</h5>:<h5>User</h5>
	}

	function showCreatorsIfExist(){
		return data.authors !== undefined?
		<div className = "headerAuthorsImagesAndNames">
			<SmallImages imagesList = {authorsImages} borderColor = {headerColors[0]}/>
			<div className = "headerAuthors">{displayAuthors(albumAuthors, ", ")}</div>
		</div>:
		null
	}

	function findIfIsVerified(){
		return data.isVerified?<ImCheckmark style = {{color:headerColors[2]}}/>:null
	}

	return (
		<div className = "Header" style = {{background:`linear-gradient(45deg, ${headerColors[2]}, ${headerColors[0]})`}}>
			<div className = "headerBtns" style = {{background:headerColors[2]}}>
				<BackBtn/>
				<div className="headerBackBtn">
					<button>
						<FiPlusCircle/>
					</button>
				</div>
				<div className="headerMoreBtn">
					<button>
						<FiMoreVertical/>
					</button>
				</div>
				{
					currentUser.uid === data.uid?
					<button onClick = {logout} >
						<IoMdExit />
					</button>:
					null
				}
			</div>
			<div className = "headerAuthorsImage" style = {data.authors === undefined?{animation: "floatingBorderRadius 10s infinite ease-in-out"}:{}}>
				<img src={data.photoURL || data.image} alt=""/>
			</div>
			<div className = "headerAuthorInfo">
				<div className="headerAuthorsName">
					{isAlbumOrIsAuthor()}
					<div style = {{display:'flex', alignItems:'center', margin: "2px 0 10px 0"}}>
						<h1>{data.displayName || data.name}</h1>
						{findIfIsVerified()}
					</div>
				</div>
				{showCreatorsIfExist()}
				<div className = "headerListenersAndSubs">
					<div className = "headerListenersAndSubsItem" title = {(data.listens ?? data.numberOfListenersPerMonth) + ' listeners per month'}>
						<span>{data.listens ?? data.numberOfListenersPerMonth}</span>
						<FiHeadphones/>
					</div>
					<div className = "headerListenersAndSubsItem" title = {data.subscribers + ' subscribers'}>
						<span>{data.subscribers}</span>
						<FiUserPlus/>
					</div>
					{displayCreationDateIfExists()}
				</div>
			</div>
		</div>
	)
}
