export function whatToWriteInResponseToItem(referedMessage) {
	return referedMessage.attachedSongs.length ? "Audio" :
		referedMessage.attachedAlbums.length ? "Album" :
			referedMessage.attachedAuthors.length ? "Author" :
				referedMessage.inResponseToMessage && referedMessage.inResponseToMessage.length ? "Forwarded message" : ""
}