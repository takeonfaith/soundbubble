import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'
import seedDatabase from './seedDatabase';

console.log(process.env.REACT_APP_FIREBASE_API_KEY)
const app = firebase.initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId:process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID
});

export const auth = app.auth()
export const storage = app.storage()
export const firestore = app.firestore()
// seedDatabase(firestore)
export default app