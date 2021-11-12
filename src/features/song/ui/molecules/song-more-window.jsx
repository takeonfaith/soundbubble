import React from "react";
import { BiEditAlt, BiListPlus } from "react-icons/bi";
import { FiInfo, FiShare } from "react-icons/fi";
import { MdKeyboardArrowRight, MdPlaylistAdd } from "react-icons/md";
import { useAuth } from "../../../../contexts/auth";
import { useModal } from "../../../../contexts/modal";
import { useSong } from "../../../../contexts/song";
import { EditSong } from "../../../admin/ui/organisms/edit-song";
import AddOrDeleteButtonFull from "../../../full-screen-player/ui/molecules/add-or-delete-song-button";
import { AddToPlaylists } from "../../../full-screen-player/ui/molecules/add-to-playlists";
import { SongInfo } from "../organisms/song-info";
import { FriendsToShareWith } from "../../../share/ui/organisms/friends-to-share-with";

const SongItemMoreWindow = ({
  openMoreWindow,
  song,
  moreWindowPosRelativeToViewport,
}) => {
  const { toggleModal, setContent, openBottomMessage } = useModal();
  const { currentUser } = useAuth();
  const { setCurrentSongQueue } = useSong();

  const addToQueue = () => {
    setCurrentSongQueue((prev) => [...prev, song]);
    openBottomMessage("Song was added to queue");
  };

  return openMoreWindow ? (
    <div
      className="songItemMenuWindow"
      style={
        moreWindowPosRelativeToViewport > window.innerHeight / 2 + 100
          ? { top: "auto", bottom: "110%" }
          : { top: "110%", bottom: "auto" }
      }
      onClick={(e) => e.stopPropagation()}
    >
      {currentUser.isAdmin ||
      song.authors.find((el) => el.uid === currentUser.uid) ? (
        <div
          className="songItemMenuWindowItem"
          onClick={() => {
            toggleModal();
            setContent(<EditSong song={song} />);
          }}
        >
          <BiEditAlt />
          Edit
        </div>
      ) : null}
      <div className="songItemMenuWindowItem">
        <AddOrDeleteButtonFull song={song} />
      </div>
      <div className="songItemMenuWindowItem">
        <div className="songItemMenuWindow inner">
          <AddToPlaylists song={song} />
        </div>
        <MdPlaylistAdd />
        Add to playlist <MdKeyboardArrowRight />
      </div>
      <div
        className="songItemMenuWindowItem"
        onClick={() => {
          toggleModal();
          setContent(<FriendsToShareWith item={song} whatToShare={"song"} />);
        }}
      >
        <FiShare />
        Share
      </div>
      <div
        className="songItemMenuWindowItem"
        onClick={() => {
          toggleModal();
          setContent(<SongInfo song={song} />);
        }}
      >
        <FiInfo />
        Info
      </div>
      <div className="songItemMenuWindowItem" onClick={addToQueue}>
        <BiListPlus />
        Add to queue
      </div>
    </div>
  ) : null;
};

export default SongItemMoreWindow;
