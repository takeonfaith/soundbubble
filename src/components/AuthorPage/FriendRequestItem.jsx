import React from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export const FriendRequestItem = ({person, addFriend, rejectFriend}) => {
	return (
		<div className = 'FriendRequestItem'>
			<Link to = {`/authors/${person.uid}`}>
				<div className = "friendRequestImageAndName">  
					<div className="requestImage">
						<img loading = "lazy" src={person.photoURL} alt="" />
					</div>
					<h3>{person.displayName}</h3>
				</div>
			</Link>
			<div className="requestButtons">
				<button style = {{color:'var(--green)'}} onClick = {()=>addFriend(person.uid)}>
					<FiCheck/>
					<span>Add</span> 
				</button>
				<button style = {{color:'var( --lightRed)'}} onClick = {()=>rejectFriend(person.uid)}>
					<FiX/>
					<span>Reject</span> 
				</button>
			</div>
		</div>
	)
}
