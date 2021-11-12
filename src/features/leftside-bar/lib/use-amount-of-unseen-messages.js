import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/auth';
import { firestore } from '../../../firebase';
import { amountOfUnseenMessages } from '../../chats/lib/amount-of-unseen-messages';

const useAmountOfUnseenMessages = () => {
	const { currentUser } = useAuth()
	const [amount, setAmount] = useState(0)

	useEffect(() => {
		const unsubscribe = firestore
			.collection("chats")
			.where("participants", "array-contains", currentUser.uid)
			.onSnapshot((snapshot) => {
				setAmount(0)
				snapshot.docs.map((chat) => {
					const chatData = chat.data()
					setAmount(prev => prev + amountOfUnseenMessages(chatData.messages, currentUser))
				})
			});
		return () => {
			unsubscribe();
		};
	}, []);

	return amount
}

export default useAmountOfUnseenMessages
