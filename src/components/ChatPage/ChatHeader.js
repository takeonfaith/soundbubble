import React from 'react'
import { useState } from 'react'
import { authors } from '../../data/authors'
import { ColorExtractor } from 'react-color-extractor'
import {BackBtn} from '../Basic/BackBtn'
import {MoreBtn} from '../Basic/MoreBtn'
import { Link } from 'react-router-dom'
import normalizeString from '../../functions/normalizeString'
export const ChatHeader = ({data}) => {
	const otherPersons = (data.participants.map(personId => authors[personId])).filter(el=>el.id!==30)
	const {image, name} = otherPersons[0]
	const [headerColors, setHeaderColors] = useState([])
	return (
		<div className = "ChatHeader" style = {headerColors.length?{background:`linear-gradient(45deg, ${headerColors[0]}, ${headerColors[1]})`}:{background:`linear-gradient(45deg, grey, lightgrey)`}}>
			<BackBtn/>
			<Link className="chatHeaderImageAndName" to = {`/authors/${normalizeString(name)}`}>
				<div className="chatHeaderImage">
					<ColorExtractor src={image} getColors={colors => setHeaderColors(colors)} />
					<img src={image} alt=""/>
				</div>
				<h4>{name}</h4>
			</Link>
			<MoreBtn/>
		</div>
	)
}
