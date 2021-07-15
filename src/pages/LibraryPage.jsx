import React, { useState } from 'react'
import "../styles/LibraryPage.css"
import { Slider } from '../components/Tools/Slider'
import { SongsPage } from '../components/LibraryPage/SongsPage'
import { PlaylistsPage } from '../components/LibraryPage/PlaylistsPage'
import { AuthorsPage } from '../components/LibraryPage/AuthorsPage'

export const LibraryPage = () => {
	const [currentPage, setCurrentPage] = useState(0)
	const libraryPages = [<SongsPage/>, <PlaylistsPage/>, <AuthorsPage/>]
	return (
		<div className="LibraryPage" style = {{animation:'zoomIn .2s forwards'}}>
			<Slider pages = {['Songs', "Playlists", "Authors"]} currentPage = {currentPage} setCurrentPage = {setCurrentPage}/>
			{libraryPages[currentPage]}
		</div>
	)
}
