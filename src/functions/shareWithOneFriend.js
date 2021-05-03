import { chat } from "../data/chat"
import createRandomId from "./createRandomId"

function createChat(id, songId, albumId = null, authorId = null) {
	const randId = createRandomId()
	chat[randId] =
	{
		id: randId,
		participants: [30, parseInt(id)],
		image: '',
		messages: [
			{
				id: 0,
				sender: 30,
				message: '',
				sentTime: new Date(),
				inResponseToMessage: null,
				attachedSongs: [songId],
				attachedAlbums: albumId !== null? [albumId]:[],
				attachedAuthors: authorId !== null? [authorId]:[],
			}
		]
	}
}

export default function shareWithOneFriend(e, songId, albumId = null, authorId = null) {
	console.log("id:",e.target.id, "songId:", songId)
	let isThereChat = false
	Object.keys(chat).forEach((chatId) => {
		if (chat[chatId].participants.includes(parseInt(e.target.id)) && chat[chatId].participants.includes(30)) {
			isThereChat = true
			chat[chatId].messages.push(
				{
					id: chat[chatId].messages.length,
					sender: 30,
					message: '',
					sentTime: new Date(),
					inResponseToMessage: null,
					attachedSongs: [songId],
					attachedAlbums: albumId !== null? [albumId]:[],
					attachedAuthors: authorId !== null? [authorId]:[],
				}
			)
		}
	})

	if (!isThereChat) createChat(e.target.id, songId, albumId, authorId)
}