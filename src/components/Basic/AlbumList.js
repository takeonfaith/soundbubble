import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { PlaylistItem } from '../AuthorPage/PlaylistItem'
import { LoadingCircle } from './LoadingCircle'

export const AlbumList = ({listOfAlbums, title = "", loading = true, listOfChosenAlbums, setListOfChosenAlbums}) => {
	// console.log(listOfAlbums)
	const [scrollLeft, setScrollLeft] = useState(0)
	const wrapperRef = useRef(null)
	const [shouldRenderRightArrow, setShouldRenderRightArrow] = useState(false)
	function scrollToLeft() {
		const prev = wrapperRef.current.scrollLeft
		wrapperRef.current.scrollLeft = prev - 220
		setScrollLeft(prev - 220)
	}
	function scrollToRight() {
		const prev = wrapperRef.current.scrollLeft
		wrapperRef.current.scrollLeft = prev + 220
		setScrollLeft(prev + 220)
	}
	useEffect(() => {
		if(listOfAlbums.length > 0 && !loading){
			const scrollBiggerThanScreen = wrapperRef.current.scrollWidth > wrapperRef.current.offsetWidth
			if (scrollBiggerThanScreen) setShouldRenderRightArrow(true)
		}
	}, [listOfAlbums])
	return listOfAlbums.length > 0?
		loading?<LoadingCircle/>:
		(
		<div className="AuthorsList" >
			{title.length !== 0 ? <h2>{title}</h2> : null}
			<div className="authorsWrapper" ref={wrapperRef} onScroll={e => setScrollLeft(e.target.scrollLeft)}>
				{listOfAlbums.map((playlist, index) => {
					return <PlaylistItem playlist = {playlist} key={index} listOfChosenAlbums = {listOfChosenAlbums} setListOfChosenAlbums = {setListOfChosenAlbums}/>
				})}
			</div>
			<div className="authorsShiftButtons">
				<button onClick={scrollToLeft} style={scrollLeft <= 0 ? { visibility: 'hidden', opacity: '0' } : {}}><FiChevronLeft /></button>
				<button onClick={scrollToRight} style={shouldRenderRightArrow && wrapperRef.current && (wrapperRef.current.scrollWidth - wrapperRef.current.offsetWidth !== scrollLeft)? {} : { visibility: 'hidden', opacity: '0' }}><FiChevronRight /></button>
			</div>
		</div>
	):null
}
