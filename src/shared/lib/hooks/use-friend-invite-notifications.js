import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/auth';
import { firestore } from '../../../firebase';

const useFriendInviteNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const { currentUser } = useAuth()

	// useEffect(() => {
	// 	const requestedPeople = currentUser.friends.filter((friend) => friend.status === 'requested')
	// 	if (requestedPeople.length) {
	// 		setNotifications(async (prev) => {
	// 			const temp = [...prev]
	// 			let result
	// 			await Promise.all(requestedPeople.map(async (person) => {
	// 				const personData = (await firestore.collection('users').doc(person.uid).get()).data()
	// 				temp.push({
	// 					image: personData.photoURL,
	// 					link: `authors/${personData.uid}`,
	// 					message: `${personData.displayName} wants to add you to friend list`
	// 				})
	// 				return temp
	// 			})).then(res => result = res.d)
	// 			return result
	// 		})
	// 	}
	// }, [currentUser.friends.length]);

	// console.log(currentUser.friends, notifications);

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

export default useFriendInviteNotifications
