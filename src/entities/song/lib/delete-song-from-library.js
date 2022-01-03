import { firestore } from "../../../firebase"
import filterArrayWithArray from "../../../shared/lib/filter-array-with-array"

/* Работает следующим образом

1. Находим uid'шники авторов песни
2. Создаем массив авторов, песни которых еще остались после удаления выбранной песни (пустой пока)
3. Создаем список песен в библиотеке пользователя, в котором нет удаляемого трека
4. Проходимся по массиву айдишников авторов
	4.1 Проходимся по массиву списка песен пользователя, в котором этот трек еще не удален
		4.1.1 Если Новый список включает в себя трек из старого И у песни из старого списка есть авторы...Пока не понимаю сам)), 
		то мы добавляем автора в список оставшихся после удаления выбранной песни 

*/

export const deleteSongFromLibrary = (e, song, currentUser, yourSongs) => {
	e.stopPropagation()
	const songAuthorsUIDS = song.authors.map(author => author.uid)
	const finalAuthorsUIDS = [] // массив авторов, песни которых еще остались после удаления выбранной песни
	let newList = currentUser.addedSongs.filter(songNum => songNum !== song.id)
	songAuthorsUIDS.forEach(authorId => {
		yourSongs.forEach(songObj => {
			if (newList.includes(songObj.id) && songObj.authors.find(a => a.uid === authorId)) {
				finalAuthorsUIDS.push(authorId)
			}
		});
	});
	const filtered = filterArrayWithArray(songAuthorsUIDS, finalAuthorsUIDS) // массив людей, которых нужно убрать из библиотеки
	const finalFilteredAuthors = filterArrayWithArray(currentUser.addedAuthors, filtered) // массив людей, оставшихся в библиотеке

	firestore.collection('users').doc(currentUser.uid).update({
		addedSongs: newList,
		addedAuthors: finalFilteredAuthors
	})

	filtered.forEach(async authorId => {
		let subscribers = (await firestore.collection('users').doc(authorId).get()).data().subscribers
		subscribers--
		firestore.collection('users').doc(authorId).update({
			subscribers: subscribers
		})
	})

}