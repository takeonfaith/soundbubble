import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { AddWindow } from '../components/AuthorPage/AddWindow'
import { Header } from '../components/AuthorPage/Header'
import { Playlists } from '../components/AuthorPage/Playlists'
import { SimilarArtists } from '../components/AuthorPage/SimilarArtists'
import { TopSongs } from '../components/AuthorPage/TopSongs'
import { LoadingCircle } from '../components/Basic/LoadingCircle'
import { firestore } from '../firebase'
import "../styles/AuthorPage.css"
export const AuthorPage = () => {
	const match = useRouteMatch('/authors/:authorId')
	const [headerColors, setHeaderColors] = useState([])
	const { authorId } = match.params
	const [authorsData, setAuthorsData] = useState([])
	const [loading, setLoading] = useState(true)
	async function fetchSongs() {
		const response = firestore.collection("users").doc(authorId)
		response.get().then((doc) => {
			if (doc.exists) {
				//  console.log("Document data:", doc.data());
				 setAuthorsData(doc.data())
				 setHeaderColors(doc.data().imageColors)
				 setLoading(false)
			} else {
				 // doc.data() will be undefined in this case
				 console.log("No such document!");
			}
	  }).catch((error) => {
			console.log("Error getting document:", error);
	  });
	}

	useEffect(() => {
		fetchSongs()
	}, [authorId])
	return (
		<div className="AuthorPage" style={{ animation: 'zoomIn .2s forwards' }}>
			{loading?
				<LoadingCircle/>:
				<>
					<Header data={authorsData} headerColors={headerColors} setHeaderColors={setHeaderColors} />
					<AddWindow data={authorsData} />
					<TopSongs author={authorId} authorsData={authorsData} headerColors={headerColors} />
					<Playlists authorsData={authorsData} headerColors={headerColors} />
					{
						authorsData!== undefined && authorsData.isAuthor?
						<SimilarArtists data={authorsData} />:
						null
					}
				</>
			}
		</div>
	)
}
