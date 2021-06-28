export function findWhatToWriteInResponseToItem(referedMessage){
	return referedMessage.attachedSongs.length ? "Audio":
	referedMessage.attachedAlbums.length? "Album":
	referedMessage.attachedAuthors.length?"Author":""
}