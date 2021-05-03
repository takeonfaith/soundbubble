import React, { useState } from 'react'
import { ColorExtractor } from 'react-color-extractor'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { authors } from '../../data/authors'
import { playlists } from '../../data/playlists'
import { songs } from '../../data/songs'
import checkNumber from '../../functions/checkNumber'
import { AuthorItemBig } from '../AuthorPage/AuthorItemBig'
import { PlaylistItem } from '../AuthorPage/PlaylistItem'
import { SongItem } from '../FullScreenPlayer/SongItem'
export const MainBanner = ({person}) => {
	const [bannerColors, setBannerColors] = useState([])
	const [currentSliderPage, setcurrentSliderPage] = useState(0)
	function findTop(list, criterion) {
		let tempArr = []
		list.forEach((el) => {
			tempArr.push(el)
		})
		tempArr.sort((song1, song2) => song2[criterion] - song1[criterion])
		return tempArr[0]
	}
	const topAuthor = findTop(authors, 'numberOfListenersPerMonth')
	const topSong = findTop(songs['allSongs'], 'listens')
	const topAlbum = findTop(playlists['allPlaylists'], 'listens')
	// console.log(person)
	function findCurrentPicture(){
		if(currentSliderPage === 0){
			return topAuthor.image
		}

		if(currentSliderPage === 1){
			return topSong.cover
		}

		return topAlbum.image
	}
	return (
		<div className = "MainBanner" style = {{background:bannerColors[2], boxShadow:`0 0 50px ${bannerColors[2] + 'ab'}`}}>
			{/* <div className = "mainBannerImage">
				<ColorExtractor src = {image} getColors={colors => setPersonColors(colors)}/>
				<img src={image} alt=""/>
			</div>
			<h2>{name}</h2> */}
			<ColorExtractor src = {findCurrentPicture()} getColors={colors => setBannerColors(colors)}/>
			<div className="slider">
				<div className={"sliderItem " + (currentSliderPage === 0?"current":"")} style = {{transform:`translateX(-${currentSliderPage*100}%)`}}>
					<h3>Most popular artist on platform</h3>
					<AuthorItemBig data = {topAuthor}/>
				</div>
				<div className={"sliderItem " + (currentSliderPage === 1?"current":"")} style = {{transform:`translateX(-${currentSliderPage*100}%)`}}>
					<h3>Most popular song on platform</h3>
					<SongItem song = {topSong} localIndex = {0}/>
				</div>
				<div className={"sliderItem " + (currentSliderPage === 2?"current":"")} style = {{transform:`translateX(-${currentSliderPage*100}%)`}}>
					<h3>Most popular album on platform</h3>
					<PlaylistItem playlist = {topAlbum}/>
				</div>
			</div>
			<div className = "sliderBtns">
				<button onClick = {()=>setcurrentSliderPage(checkNumber(currentSliderPage-1, 2, 0))}><BiChevronLeft/></button>
				<button onClick = {()=>setcurrentSliderPage(checkNumber(currentSliderPage+1, 2, 0))}><BiChevronRight/></button>
			</div>
		</div>
	)
}
