import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { firestore } from '../../../firebase';

const useChatNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const { currentUser } = useAuth()

	useEffect(() => {
		const unsubscribe = firestore
			.collection("chats")
			.where("participants", "array-contains", currentUser.uid)
			.onSnapshot((snapshot) => {
				setNotifications((prev) => {
					const temp = [...prev];
					snapshot.docChanges().map(async (doc) => {
						if (doc.type === "modified" && doc.doc.data().messages.length) {
							const { id, chatName, chatImage, messages } = doc.doc.data();
							const lastMessage = messages[messages.length - 1];
							const shouldPushNotif =
								lastMessage.sender !== currentUser.uid &&
								!lastMessage.seenBy.includes(currentUser.uid)

							if (shouldPushNotif) {
								temp.push({
									chatId: id,
									chatName,
									chatImage,
									message: messages[messages.length - 1],
									userId: messages[messages.length - 1].sender,
								});
							}
						}
					});
					return temp;
				});
			});
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (notifications.length) {
			let timeout;
			timeout = setTimeout(() => {
				setNotifications((prev) => prev.slice(1, prev.length));
			}, 4700);
		}
	}, [notifications.length]);

	return [notifications, setNotifications]
}

export default useChatNotifications
