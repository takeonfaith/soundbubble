import React, { useEffect, useState } from 'react'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { useAuth } from '../../functionality/AuthContext'
import { useModal } from '../../functionality/ModalClass'
import { useSong } from '../../functionality/SongPlay/SongContext'
import shareWithFriends from '../../functions/shareWithManyFriends'
import { PersonTiny } from './PersonTiny'
import { SearchBar } from '../Basic/SearchBar'
export const FriendsListToShareWith = ({ item, whatToShare = 'song' }) => {
	const { yourFriends } = useSong()
	const [chosenFriends, setChosenFriends] = useState([])
	const { currentUser } = useAuth()
	const [messageText, setMessageText] = useState("")
	const [shared, setShared] = useState(false)
	const { toggleModal } = useModal()
	const [searchValue, setSearchValue] = useState('')
	const [foundPeople, setFoundPeople] = useState([])
	function removeFriendFromList(data) {
		const filtered = chosenFriends.filter(peopleId => peopleId !== data.uid)
		return setChosenFriends(filtered)
	}

	useEffect(() => {
		if (shared) {
			setTimeout(() => {
				toggleModal()
				setShared(false)
			}, 1000)
		}
	}, [shared])


	return (
		<div className='FriendsListToShareWith'>
			{shared ?
				<div className="successMessageSent">
					<IoIosCheckmarkCircleOutline />
					Song has sent!
				</div> : null
			}
			<SearchBar value={searchValue} setValue={setSearchValue} setResultAuthorList={setFoundPeople} defaultSearchMode={"authors"} inputText = {"Search for friends"}/>
			{/* <h2>Share with friends</h2> */}
			<div>
				{foundPeople.length > 0 ?
					foundPeople.map((data, index) => {
						return (
							<PersonTiny data={data} showChoose chosenArray={chosenFriends} setChosenArray = {setChosenFriends} key={index} />
						)
					}):
					yourFriends.map((data, index) => {
						return (
							<PersonTiny data={data} showChoose chosenArray={chosenFriends} setChosenArray = {setChosenFriends} key={index} />
						)
					})
				}
			</div>
			<div>
				<form>
					<input type="text" placeholder="Your message" style={{ margin: 0 }} onChange={e => setMessageText(e.target.value)} />
				</form>
				<button
					className="shareBtn"
					style={!chosenFriends.length ?
						{
							opacity: 0.5,
							maxWidth: 'none',
							background: 'var(--purpleAndBlueGrad)'
						} :
						{
							maxWidth: 'none',
							background: 'var(--purpleAndBlueGrad)'
						}
					}
					onClick={() => {
						if (chosenFriends.length > 0) {
							shareWithFriends(chosenFriends, currentUser, (whatToShare === 'author' ? item.uid : item.id), whatToShare, messageText);
							setShared(true)
						}
					}
					}>
					Share with {chosenFriends.length} {chosenFriends.length > 1 ? "friends" : "friend"}
				</button>
			</div>
		</div>
	)
}
