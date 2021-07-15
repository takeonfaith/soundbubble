import React, { useContext, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase'
import firebase from 'firebase'
import { LoadingData } from '../components/Loading/LoadingData'
import { findVariantsOfName } from '../functions/find/findVariantsOfName'

const AuthContext = React.createContext()

export const useAuth = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({})
	const [userId, setUserId] = useState(null)
	const [loading, setLoading] = useState(true)
	function login(email, password, setError, setLoading) {
		setLoading(true)
		return auth.signInWithEmailAndPassword(email, password).then().catch(err => {
			setError(err.message)
			setLoading(false)
		})
	}

	function logout() {
		return auth.signOut()
	}

	function signup(email, name, password, role, photoURL, imageColors, setError, setLoading) {
		setLoading(true)
		return auth.createUserWithEmailAndPassword(email, password)
			.then((result) => {
				firestore.collection('users')
					.doc(result.user.uid)
					.set({
						uid: result.user.uid,
						displayName: name,
						photoURL: photoURL || "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/music-icon-mohammed-jabir-ap.jpg",
						isAuthor: parseInt(role) === 1,
						isVerified: parseInt(role) === 1,
						numberOfListenersPerMonth: 0,
						ownSongs: [],
						ownPlaylists: [],
						addedSongs: [],
						addedPlaylists: [],
						addedAuthors: [],
						lastSongPlayed: "",
						chats: [],
						friends: [],
						subscribers: 0,
						regDate: firebase.firestore.FieldValue.serverTimestamp(),
						imageColors: imageColors
					})
				firestore.collection('search').doc(result.user.uid).set({
					place: 'users',
					uid: result.user.uid,
					variantsOfName: findVariantsOfName(name)
				})
				setLoading(false)
			}).catch(err => {
				setError(err.message)
			})
	}

	useEffect(() => {
		if(userId !== null){
			const unsubscribe = firestore.collection('users').doc(userId).onSnapshot(user => {
				if (user.data()) {
					if(currentUser.uid === undefined){
						setCurrentUser(user.data())
					}
				}
			})
			return unsubscribe
		}
	}, [firestore, userId])

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async user => {
			if (user) {
				setUserId(user.uid)
			}
			else {
				setUserId(null)
				setCurrentUser({})
				setLoading(false)
			}
		})
		return unsubscribe
	}, [])


	const value = {
		currentUser,
		setCurrentUser,
		login,
		signup,
		logout,
		loading,
		setLoading
	}
	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}
