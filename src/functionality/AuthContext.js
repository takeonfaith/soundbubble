import React, { useContext, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase'
import firebase from 'firebase'
import { LoadingData } from '../components/Basic/LoadingData'

const AuthContext = React.createContext()

export const useAuth = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({})
	const [loading, setLoading] = useState(true)
	function login(email, password, setError, setLoading) {
		setLoading(true)
		return auth.signInWithEmailAndPassword(email, password).then().catch(err=>{
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
						lastSongPlayed:"",
						chats: [],
						friends: [],
						subscribers: 0,
						regDate: firebase.firestore.FieldValue.serverTimestamp(),
						imageColors: imageColors
					})
				setLoading(false)
			}).catch(err=>{
				setError(err.message)
			})
	}

	async function fetchUserInfo(userId) {
		let dataObject = {}

		return dataObject
	}

	// useEffect(() => {
	// 	const unsubscribe = auth.onAuthStateChanged(async user => {
	// 		if (user) {
	// 			const response = await firestore.collection('users').doc(user.uid).onSnapshot(snapshot => {
	// 				const fullUserInfo = { ...user, ...snapshot.data() }
	// 				console.log("worked!")
	// 				setCurrentUser(fullUserInfo)
	// 			})
	// 		}
	// 	})
	// 	return unsubscribe
	// }, [firestore])

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async user => {
			if (user) {
				const response = await firestore.collection('users').doc(user.uid).get().then(snapshot => {
					const fullUserInfo = { ...user, ...snapshot.data() }
					setCurrentUser(fullUserInfo)
					setLoading(false)
				})
			}
			else {
				setCurrentUser(user)
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
