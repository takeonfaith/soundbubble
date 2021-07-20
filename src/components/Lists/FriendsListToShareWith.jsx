import React, { useEffect, useState } from 'react'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { useAuth } from '../../contexts/AuthContext'
import { useModal } from '../../contexts/ModalContext'
import { useSong } from '../../contexts/SongContext'
import shareWithFriends from '../../functions/other/shareWithManyFriends'
import { PersonTiny } from '../Basic/PersonTiny'
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

	useEffect(() => {
		if (shared) {
			setTimeout(() => {
				toggleModal()
				setShared(false)
			}, 1000)
		}
	}, [shared])


	return yourFriends.length?(
		<div className='FriendsListToShareWith'>
			{shared ?
				<div className="successMessageSent">
					<IoIosCheckmarkCircleOutline />
					Message has sent!
				</div> : null
			}
			<div style = {{overflowY:'auto', maxHeight:'300px'}}>	
				<SearchBar value={searchValue} setValue={setSearchValue} setResultAuthorList={setFoundPeople} defaultAuthorsListValue = {yourFriends} defaultSearchMode={"authors"} inputText = {"Search for friends"}/>
				<div>
					{foundPeople.length > 0 ?
						foundPeople.map((data, index) => {
							return (
								<PersonTiny data={data} chosenArray={chosenFriends} setChosenArray = {setChosenFriends} key={index} />
							)
						}):
						yourFriends.map((data, index) => {
							return (
								<PersonTiny data={data} chosenArray={chosenFriends} setChosenArray = {setChosenFriends} key={index} />
							)
						})
					}
				</div>
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
	): <h3 style = {{margin:0}}>No friends added</h3>
}
