import React, { useEffect, useState } from 'react'
import { ColorExtractor } from 'react-color-extractor'
import { FiHeadphones, FiMoreVertical, FiPlusCircle, FiUserPlus } from 'react-icons/fi'
import { ImCheckmark } from 'react-icons/im'
import { authors } from '../../data/authors'
import { useSong } from '../../functionality/SongPlay/SongContext'
import displayDate from '../../functions/displayDate'
import { BackBtn } from '../Basic/BackBtn'
import { SmallImages } from './SmallImages'
export const Header = ({data, headerColors, setHeaderColors}) => {
	const {displayAuthors} = useSong()
	const [albumAuthors, setAlbumAuthors] = useState([])
	const [authorsImages, setAuthorsImages] = useState([])
	useEffect(() => {
		if(data.authors !== undefined && !albumAuthors.length){
			const tempArr = authors.filter(author=>data.authors.includes(author.id))
			tempArr.forEach((a)=>{
				setAlbumAuthors(prev=>[...prev, a.name])
				setAuthorsImages(prev=>[...prev, a.image])
			})
		}
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
			<SmallImages imagesList = {authorsImages} borderColor = {headerColors[1]}/>
			<div className = "headerAuthors">{displayAuthors(albumAuthors, ", ")}</div>
		</div>:
		null
	}

	function findIfIsVerified(){
		return data.isVerified?<ImCheckmark style = {{color:headerColors[2]}}/>:null
	}
	return (
		<div className = "Header" style = {{background:`linear-gradient(45deg, ${headerColors[3]}, ${headerColors[0]})`}}>
			<div className = "headerBtns" style = {{background:headerColors[3]}}>
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
			</div>
			<div className = "headerAuthorsImage" style = {data.authors === undefined?{animation: "floatingBorderRadius 10s infinite ease-in-out"}:{}}>
				<ColorExtractor src = {data.image} getColors={colors => setHeaderColors(colors)}/>
				<img src={data.image} alt=""/>
			</div>
			<div className = "headerAuthorInfo">
				<div className="headerAuthorsName">
					{isAlbumOrIsAuthor()}
					<div style = {{display:'flex', alignItems:'center', margin: "2px 0 10px 0"}}>
						<h1>{data.name}</h1>
						{findIfIsVerified()}
					</div>
				</div>
				{showCreatorsIfExist()}
				<div className = "headerListenersAndSubs">
					<div className = "headerListenersAndSubsItem">
						<span>{data.numberOfListenersPerMonth || data.listens}</span>
						<FiHeadphones/>
					</div>
					<div className = "headerListenersAndSubsItem">
						<span>{data.subscribers}</span>
						<FiUserPlus/>
					</div>
					{displayCreationDateIfExists()}
				</div>
			</div>
		</div>
	)
}
