import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { AddWindow } from '../components/AdminAndAuthor/AddWindow'
import { FriendRequest } from '../components/AuthorPage/FriendRequest'
import { Header } from '../components/AuthorPage/Header'
import { PersonTinyList } from '../components/AuthorPage/PersonTinyList'
import { Playlists } from '../components/AuthorPage/Playlists'
import { SimilarArtists } from '../components/AuthorPage/SimilarArtists'
import { TopSongs } from '../components/AuthorPage/TopSongs'
import { LoadingCircle } from '../components/Loading/LoadingCircle'
import { firestore } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import "../styles/AuthorPage.css"
import { useHistory } from 'react-router-dom'
export const AuthorPage = () => {
	const match = useRouteMatch('/authors/:authorId')
	const {currentUser} = useAuth()
	const [headerColors, setHeaderColors] = useState([])
	const { authorId } = match.params
	const [authorsData, setAuthorsData] = useState([])
	const [loading, setLoading] = useState(true)
	const history = useHistory()
	async function fetchAuthorsData() {
		const response = firestore.collection("users").doc(authorId)
		response.get().then((doc) => {
			if (doc.exists) {
				 setAuthorsData(doc.data())
				 setHeaderColors(doc.data().imageColors)
				 setLoading(false)
			} else {
				 history.push('/not-found')
			}
	  }).catch((error) => {
			console.log("Error getting document:", error);
	  });
	}

	useEffect(() => {
		fetchAuthorsData()
	}, [authorId])
	return (
		<div className="AuthorPage" style={{ animation: 'zoomIn .2s forwards' }}>
			{loading?
				<LoadingCircle/>:
				<>
					<Header data={authorsData} headerColors={headerColors} setHeaderColors={setHeaderColors} />
					{currentUser.uid === authorsData.uid?<FriendRequest/>:null} 
					<AddWindow data={authorsData} />
					<TopSongs author={authorId} authorsData={authorsData} headerColors={headerColors} />
					{authorsData.friends && !authorsData.isAuthor?<PersonTinyList data = {authorsData} title = {"Friends"}/>:null}
					<Playlists authorsData={authorsData} headerColors={headerColors} />
					{
						authorsData.isAuthor?
						<SimilarArtists data={authorsData} />:
						null
					}
				</>
			}
		</div>
	)
}
