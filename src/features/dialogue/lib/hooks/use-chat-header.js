import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext';
import { useModal } from '../../../../contexts/ModalContext';
import { firestore } from '../../../../firebase';

const useChatHeader = (data) => {
	const { currentUser } = useAuth();

	const [otherPerson, setOtherPerson] = useState({});
	const [headerColors, setHeaderColors] = useState(
		!!data.chatName ? [] : data.imageColors
	);
	async function fetchOtherPerson() {
		const otherPersonId = data.participants.find(
			(personId) => personId !== currentUser.uid
		);
		const person = (
			await firestore.collection("users").doc(otherPersonId).get()
		).data();
		setOtherPerson(person);
		setHeaderColors(person.imageColors);
	}

	useEffect(() => {
		if (!data.chatName.length) {
			fetchOtherPerson();
		}
	}, [data.id]);

	return [otherPerson, headerColors]
}

export default useChatHeader
