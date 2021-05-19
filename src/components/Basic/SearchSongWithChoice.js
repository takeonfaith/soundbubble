import React, { useEffect, useState } from 'react'
import { FiSearch, FiX, FiXCircle } from 'react-icons/fi'
import { firestore } from '../../firebase'
import { BackBtn } from './BackBtn'
import { LoadingCircle } from './LoadingCircle'
import { SongItemChoice } from './SongItemChoice'

export const SearchSongWithChoice = ({value, setValue, chosenSongs, setChosenSongs, allFoundSongs, setAllFoundSongs}) => {
	const [loading, setLoading] = useState(false)
	let typingTimeout
	async function findSongs(e) {
		setLoading(true)
		setAllFoundSongs([])
		const response = firestore.collection("songs")
			.where("name", "==", value)
		const data = await response.get();
		data.docs.forEach(item => {
			if(!allFoundSongs.includes(item.data())){
				setAllFoundSongs(prevSongs=>[...prevSongs, item.data()])
			}
		})
		setLoading(false)
	}

	function removeSongFromList(data) {
		const filtered = chosenSongs.filter(song => song !== data)
		return setChosenSongs(filtered)
	}

	function timerUpFunc(func) {
		clearTimeout(typingTimeout)
		setTimeout(func, 1000)
	}
	
	return (
		<div> 
			<div className="searchBar">
				<div className="searchBarElement">
					<BackBtn color={allFoundSongs ?? allFoundSongs[0].imageColors} />
					<span onClick={() => value.length ? setValue("") : null}>{value.length ? <FiX /> : <FiSearch />}</span>
				</div>
				<input type="text" placeholder="Search for songs" value={value} onChange={(e) => setValue(e.target.value)} onKeyUp={() => timerUpFunc(findSongs)} onKeyDown={() => clearTimeout(typingTimeout) } />
			</div>
			
			<div className="chosenAuthorsList">
				{chosenSongs.map((songId, index) => {
					return (
						<div className="chosenAuthorItem">
							<span>{songId}</span>
							<FiXCircle onClick={() => removeSongFromList(songId)} />
						</div>
					)
				})}
			</div>
			<div className="authorsResult">
				{loading ?
					<div style={{ position: 'relative', width: '100%', height: '50px' }}>
						<LoadingCircle />
					</div> :
					allFoundSongs.map((data, index) => {
						return (
							<SongItemChoice song={data} listOfSongs={chosenSongs} setListOfSongs={setChosenSongs} />
						)
					})}
			</div>
		</div>
	)
}
