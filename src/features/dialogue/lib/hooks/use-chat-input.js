import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../contexts/auth';
import { useSong } from '../../../../contexts/song';
import { firestore } from '../../../../firebase';
import useOutsideClick from '../../../../shared/lib/hooks/use-outside-click';
import { sendMessage } from '../send-message';

const useChatInput = (chatId, chatData, inResponseToMessage, setInResponseToMessage, messageText, setMessageText, otherMessages) => {
	const { currentUser } = useAuth();
	const [openAttachWindow, setOpenAttachWindow] = useState(false);
	const { yourSongs, yourAuthors, yourPlaylists } = useSong();
	const [searchValue, setSearchValue] = useState("");
	const [allFoundSongs, setAllFoundSongs] = useState(yourSongs);
	const [attachedSongs, setAttachedSongs] = useState([]);
	const [attachedAlbums, setAttachedAlbums] = useState([]);
	const [attachedAuthors, setAttachedAuthors] = useState([]);
	const [resultPlaylists, setResultPlaylists] = useState(yourPlaylists);
	const [resultAuthorList, setResultAuthorList] = useState(yourAuthors);
	const [inResponseNames, setInResponseNames] = useState([]);
	const [attachedSongsNames, setAttachedSongsNames] = useState([]);
	const attachWindowRef = useRef(null);


	useOutsideClick(attachWindowRef, setOpenAttachWindow);

	function sendMessageFull() {
		sendMessage(
			chatId,
			chatData,
			currentUser.uid,
			messageText,
			attachedSongs,
			attachedAlbums,
			attachedAuthors,
			inResponseToMessage
		);
		setMessageText("");
		setAttachedSongs([]);
		setAttachedAuthors([]);
		setAttachedAlbums([]);
		setInResponseToMessage([]);
		setOpenAttachWindow(false);
	}
	useEffect(() => {
		if (searchValue.length === 0) {
			setAllFoundSongs(yourSongs);
		}
	}, [searchValue]);

	function removeMessageFromResponseList(messageId) {
		setInResponseToMessage(
			inResponseToMessage.filter((id) => id !== messageId)
		);
	}

	useEffect(() => {
		if (messageText.length === 0) {
			firestore
				.collection("chats")
				.doc(chatId)
				.update({
					typing: chatData.typing.filter((id) => id !== currentUser.uid),
				});
		} else {
			if (!chatData.typing.includes(currentUser.uid)) {
				const tempArray = chatData.typing;
				tempArray.push(currentUser.uid);
				firestore.collection("chats").doc(chatId).update({
					typing: tempArray,
				});
			}
		}
	}, [messageText]);

	useEffect(() => {
		setInResponseNames([]);
		inResponseToMessage.forEach(async (id) => {
			const name = (
				await firestore
					.collection("users")
					.doc(otherMessages[id].sender)
					.get()
			).data().displayName;
			setInResponseNames((prev) => [...prev, name]);
		});
	}, [inResponseToMessage.length]);

	useEffect(() => {
		setAttachedSongsNames([]);
		attachedSongs.forEach(async (id) => {
			const name = (await firestore.collection("songs").doc(id).get()).data()
				.name;
			setAttachedSongsNames((prev) => [...prev, name]);
		});
	}, [attachedSongs.length]);

	return {
		openAttachWindow,
		setOpenAttachWindow,
		attachWindowRef,
		searchValue,
		setSearchValue,
		setAllFoundSongs,
		setResultPlaylists,
		setResultAuthorList,
		allFoundSongs,
		setAttachedSongs,
		resultAuthorList,
		resultPlaylists,
		attachedAuthors,
		attachedAlbums,
		attachedSongs,
		setAttachedAuthors,
		setAttachedAlbums,
		attachedSongsNames,
		removeMessageFromResponseList,
		inResponseNames,
		sendMessageFull,
	}
}

export default useChatInput
