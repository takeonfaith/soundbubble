import React from 'react'
import { CgMusicNote } from 'react-icons/cg';
import rightFormanForBigNumber from '../../../../functions/other/rightFormatForBigNumber';

const ShowAdditionInfo = ({ showListens, isNewSong, song }) => {
	return showListens ? (
		<span
			style={{
				display: "flex",
				alignItems: "center",
				opacity: 0.7,
				fontSize: ".8em",
			}}
			className={isNewSong ? "newSongMarker" : ""}
		>
			{rightFormanForBigNumber(song.listens)} <CgMusicNote />
		</span>
	) : isNewSong ? (
		<span
			style={{ display: "flex", alignItems: "center", fontSize: ".7em" }}
			className={"newSongMarker"}
		>
			New
		</span>
	) : null;

}

export default ShowAdditionInfo
