import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase'
import { useAuth } from '../../functionality/AuthContext'
import { FriendRequestItem } from './FriendRequestItem'

export const FriendRequest = () => {
	const {currentUser} = useAuth()
	const [friendRequests, setFriendRequests] = useState([])
	function fetchFriendRequests(){
		currentUser.friends.forEach(async (friendObj)=>{
			if(friendObj.status === 'requested'){
				const personData = (await firestore.collection('users').doc(friendObj.uid).get()).data()
				setFriendRequests(prev=>[...prev, personData])
			}
		})
	}

	useEffect(() => {
		fetchFriendRequests()
	}, [])

	function addFriend(uid){
		const friendsList = currentUser.friends
		const otherUserFriendList = friendRequests.find(person=>person.uid === uid).friends
		friendsList.find(obj=>obj.uid === uid).status = "added"
		otherUserFriendList.find(obj=> obj.uid === currentUser.uid).status = "added"

		firestore.collection('users').doc(currentUser.uid).update({
			friends:friendsList
		})
		firestore.collection('users').doc(uid).update({
			friends:otherUserFriendList
		})

		currentUser['friends'] = friendsList
	}

	function rejectFriend(uid){
		const friendsList = currentUser.friends
		const otherUserFriendList = friendRequests.find(person=>person.uid === uid).friends
		friendsList.find(obj=>obj.uid === uid).status = "rejected"
		otherUserFriendList.find(obj=> obj.uid === currentUser.uid).status = "rejected"

		firestore.collection('users').doc(currentUser.uid).update({
			friends:friendsList
		})
		firestore.collection('users').doc(uid).update({
			friends:otherUserFriendList
		})
	}
	
	return (
		<div>
			{friendRequests.map((person, index)=>{
				return <FriendRequestItem person = {person} key = {index} addFriend = {addFriend} rejectFriend = {rejectFriend}/>
			})}
		</div>
	)
}
