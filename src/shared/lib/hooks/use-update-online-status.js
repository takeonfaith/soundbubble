import { useEffect, useMemo } from 'react';
import { useAuth } from '../../../contexts/auth';
import { firestore } from '../../../firebase';

const useUpdateOnlineStatus = () => {
	const { currentUser } = useAuth()
	const fiveMinutes = useMemo(() => 300000, []);

	const updateOnlineStatus = () => {
		firestore
			.collection("users")
			.doc(currentUser.uid)
			.update({ online: new Date().getTime() });
	}

	useEffect(() => {
		const interval = setInterval(() => {
			updateOnlineStatus()
		}, fiveMinutes);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		updateOnlineStatus()
	}, []);
}

export default useUpdateOnlineStatus
