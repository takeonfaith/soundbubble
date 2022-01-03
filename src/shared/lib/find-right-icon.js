import { BiAlbum } from "react-icons/bi";
import { FiMusic, FiSearch, FiUser } from "react-icons/fi";

const findRightIcon = (type) => {
	switch (type) {
		case "songs":
			return <FiMusic style={{ color: 'var(--reallyLightBlue)' }} />;
		case "playlists":
			return <BiAlbum style={{ color: 'var(--lightPurple)' }} />;
		case "users":
			return <FiUser style={{ color: 'var(--pink)' }} />;
		case "search":
			return <FiSearch />;
		default:
			return <FiMusic />;
	}
};

export default findRightIcon
