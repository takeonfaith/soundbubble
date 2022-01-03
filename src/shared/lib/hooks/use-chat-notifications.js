import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { useAuth } from '../../../contexts/auth';
import { firestore } from '../../../firebase';

const useChatNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const { currentUser } = useAuth()
	const match = useRouteMatch("/chat/:chatId");
	const chatId = match?.params?.chatId

	useEffect(() => {
		const tempObj = {}
		const unsubscribe = firestore
			.collection("chats")
			.where("participants", "array-contains", currentUser.uid)
			.onSnapshot((snapshot) => {
				setNotifications((prev) => {
					const temp = [...prev];
					snapshot.docChanges().map(async (doc) => {
						const chatData = doc.doc.data()
						if (chatId !== chatData.id) {
							if (doc.type === 'added') tempObj[chatData.id] = chatData.messages.length
							else if (doc.type === "modified" && chatData.messages.length && !!tempObj[chatData.id] && chatData.messages.length !== tempObj[chatData.id]) {
								const { id, chatName, chatImage, messages } = chatData;
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
									tempObj[id] += 1
								}
							}
						}
					});
					return temp;
				});
			});
		return () => {
			unsubscribe();
		};
	}, [chatId]);

	useEffect(() => {
		if (notifications.length) {
			let timeout;
			timeout = setTimeout(() => {
				setNotifications((prev) => prev.slice(1, prev.length));
			}, 6200);

			return () => clearTimeout(timeout)
		}
	}, [notifications.length]);

	return [notifications, setNotifications]
}

export default useChatNotifications
