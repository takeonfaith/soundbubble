import React, { useEffect, useState } from 'react'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { useAuth } from '../../functionality/AuthContext'
import { useModal } from '../../functionality/ModalClass'
import { useSong } from '../../functionality/SongPlay/SongContext'
import shareWithFriends from '../../functions/shareWithManyFriends'
import { PersonTiny } from './PersonTiny'

export const FriendsListToShareWith = ({song}) => {
	const { yourFriends } = useSong()
	const [chosenFriends, setChosenFriends] = useState([])
	const {currentUser} = useAuth()
	const [shared, setShared] = useState(false)
	const {toggleModal} = useModal()
	function removeFriendFromList(data) {
		const filtered = chosenFriends.filter(peopleId => peopleId !== data.uid)
		return setChosenFriends(filtered)
	}

	function addFriend(data) {
		if (!chosenFriends.some(personId => personId === data.uid)) {
			return setChosenFriends(prev => [...prev, data.uid])
		}

		removeFriendFromList(data)
	}

	useEffect(() => {
		if(shared){
			setTimeout(()=>{
				toggleModal()
				setShared(false)
			}, 1000)
		}
	}, [shared])


	return (
		<div className='FriendsListToShareWith'>
			{shared?
				<div className = "successMessageSent">
					<IoIosCheckmarkCircleOutline/>
					Song has sent!
				</div>:null
			}
			<h2>Share with friends</h2>
			<div>
				{yourFriends.map((data, index) => {
					return (
						<PersonTiny data={data} showChoose chosenArray = {chosenFriends} onClick={() => addFriend(data)} key={index} />
					)
				})}
			</div>
			<div>
				<form>
					<input type="text" placeholder="Your message" style={{ margin: 0 }} />
				</form>
				<button className="shareBtn" style={!chosenFriends.length ? { opacity:0.5, maxWidth: 'none', background: 'var(--purpleAndBlueGrad)' } : { maxWidth: 'none', background: 'var(--purpleAndBlueGrad)' }} onClick={()=>{shareWithFriends(chosenFriends, currentUser, song.id);setShared(true)}}>Share with {chosenFriends.length} {chosenFriends.length > 1 ? "friends" : "friend"}</button>
			</div>
		</div>
	)
}
