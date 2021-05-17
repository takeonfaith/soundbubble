import { songs } from "./data/songs";
import { storage } from "./firebase";

export default function seedDatabase(firestore) {
	function getUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
			const piece = (Math.random() * 16) | 0;
			const elem = c === 'x' ? piece : (piece & 0x3) | 0x8;
			return elem.toString(16);
		});
	}

	// firestore.collection('songs').doc('19f5a891-7d2b-4757-b49c-919739b22eeb').update({
	// 	lyrics:songs['allSongs'][3].lyrics
	// })

	// async function findURL(fileURL){
	// 	const storageRef = storage.ref()
	// 	const fileRef = storageRef.child(fileURL)
	// 	let url = ""
	// 	url = await fileRef.getDownloadURL()
	// 	return url
	// }

	// function findSong(name){
	// 	return Promise.resolve(findURL(`/songs/${name}.mp3`)).then(result=>{
	// 		return result
	// 	})
	// }
	// function findSongImage(name){
	// 	return Promise.resolve(findURL(`/songsImages/${name}`)).then(result=>{
	// 		return result
	// 	})
	// }
	
	// songs['allSongs'].map((song, index)=>{
	// 	let randomId = getUID()
	// 	// findSong(song.name)
	// 	// findSongImage(song.img)
	// 	firestore.collection('songs').doc(randomId).set({
	// 		id:randomId,
	// 		name: song.name,
	// 		songSrc: 'songs/' + song.name,
	// 		authors: song.authors,
	// 		cover: 'songsImages/' + song.img,
	// 		listens:song.listens,
	// 		releaseDate:song.releaseDate,
	// 		lyrics: song.lyrics
	// 	})
	// })
}