import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'
import seedDatabase from './seedDatabase';

console.log(process.env.REACT_APP_FIREBASE_API_KEY)
const app = firebase.initializeApp({
	apiKey: "AIzaSyBuDoETyUrO2RCDAlFMsW2uV-QmtCT8t6Y",
	authDomain: "soundbubble-27737.firebaseapp.com",
	projectId: "soundbubble-27737",
	storageBucket: "soundbubble-27737.appspot.com",
	messagingSenderId: "527274299416",
	appId:"1:527274299416:web:64b1ac2d05f4262df0736d",
	measurementId: "G-9TP9PEEV11"
});

export const auth = app.auth()
export const storage = app.storage()
export const firestore = app.firestore()
// seedDatabase(firestore)
export default app