import React, { useContext, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase'
import firebase from 'firebase'
import { LoadingData } from '../components/Basic/LoadingData'

const AuthContext = React.createContext()

export const useAuth = () =>{
	return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
	const [currentUser, setCurrentUser] = useState({})
	const [loading, setLoading] = useState(true)
	function login(email, password){
		return auth.signInWithEmailAndPassword(email, password)
	}

	function logout(){
		return auth.signOut()
	}

	function signup(email, name, password, role, photoURL, imageColors){
		return auth.createUserWithEmailAndPassword(email, password)
			.then((result)=>{
				firestore.collection('users')
				.doc(result.user.uid)
				.set({
					uid:result.user.uid,
					displayName:name,
					photoURL:photoURL || "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/music-icon-mohammed-jabir-ap.jpg",
					isAuthor: parseInt(role) === 1,
					isVerified: parseInt(role) === 1,
					numberOfListenersPerMonth: 0,
					ownSongs:[],
					ownPlaylists:[],
					addedSongs:[],
					addedPlaylists:[],
					addedAuthors:[],
					chats:[],
					friends:[],
					subscribers: 0,
					regDate: firebase.firestore.FieldValue.serverTimestamp(),
					imageColors:imageColors
				})
			})
	}

	async function fetchUserInfo(userId) {
		let dataObject = {}
		const response = await firestore.collection('users').doc(userId).get()
			.then(snapshot => {
				console.log(snapshot.data())
				dataObject = snapshot.data()
			})
			.catch(err => {
				console.log('Error getting documents', err);
			});
		return dataObject
	}

	useEffect(() => {
		const unsubscribe = 	auth.onAuthStateChanged(user=>{
			if(user){
				Promise.resolve(fetchUserInfo(user.uid)).then((result)=>{
					const fullUserInfo = {...user, ...result}
					console.log(result)
					setCurrentUser(fullUserInfo)
					setLoading(false)
				})
			}
			else{
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
		<AuthContext.Provider value = {value}>
			{children}
		</AuthContext.Provider>
	)
}
