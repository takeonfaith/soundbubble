import React, { useEffect, useRef, useState } from 'react'
import { FiSearch, FiXCircle } from 'react-icons/fi'
import { LoadingCircle } from '../Loading/LoadingCircle'
import { useFindSomething } from '../../hooks/useFindSomething'
export const SearchBar = ({ value, setValue, setAllFoundSongs, setResultPlaylists, setResultAuthorList, focus = false, defaultSearchMode = undefined, inputText = "Search for songs or for people", defaultSongsListValue, defaultAuthorsListValue, defaultPlaylistsListValue }) => {

	const [searchMode, setSearchMode] = useState(0)
	const inputRef = useRef(null)
	const [findSomething, message, loading, foundAnything] = useFindSomething(
		value,
		setAllFoundSongs,
		setResultAuthorList,
		setResultPlaylists,
		defaultSearchMode,
		searchMode,
		defaultSongsListValue,
		defaultAuthorsListValue,
		defaultPlaylistsListValue
	)

	useEffect(() => {
		if (focus) inputRef.current.focus()
	}, [])


	return (
		<div style={{ marginTop: '10px', width: '100%' }} className = "searchBarWrapper">
			<div className="searchBar">
				<div className="searchBarElement">
					<FiSearch />
					<span onClick={() => value.length ? setValue("") : null}>{value.length ? <FiXCircle /> : null}</span>
				</div>
				<input
					type="text"
					placeholder={inputText}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={e => { if (e.key === 'Enter') findSomething() }}
					ref={inputRef}
				/>
				<div className="searchFilters" style={defaultSearchMode !== undefined ? { display: 'none' } : {}}>
					<button onClick={() => setSearchMode(0)} style={searchMode === 0 ? { background: 'var(--lightBlue)' } : {}}>All</button>
					<button onClick={() => setSearchMode(1)} style={searchMode === 1 ? { background: 'var(--lightBlue)' } : {}}>Songs</button>
					<button onClick={() => setSearchMode(2)} style={searchMode === 2 ? { background: 'var(--lightBlue)' } : {}}>Authors</button>
					<button onClick={() => setSearchMode(3)} style={searchMode === 3 ? { background: 'var(--lightBlue)' } : {}}>Playlists</button>
				</div>
			</div>
			<div className="authorsResult">
				{loading ?
					<div style={{ position: 'relative', width: '100%', height: '50px', marginTop: '40px' }}>
						<LoadingCircle />
					</div> :
					!foundAnything && value.length !== 0 ? <h2>Not found</h2> : null}
			</div>
		</div>
	)
}
