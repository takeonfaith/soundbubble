import React from "react";
import { BiEditAlt } from "react-icons/bi";
import { FiInfo, FiShare, FiUsers } from "react-icons/fi";
import { MdPlaylistAdd } from "react-icons/md";
import { SongInfo } from "../../../song/ui/organisms/song-info";
import { FriendsToShareWith } from "../../../share/ui/organisms/friends-to-share-with";
import { useAuth } from "../../../../contexts/auth";
import { useModal } from "../../../../contexts/modal";
import { EditSong } from "../../../admin/ui/organisms/edit-song";
import { AuthorsList } from "../../../full-screen-player/ui/atoms/authors-list";
import AddOrDeleteButtonFull from "../../../full-screen-player/ui/molecules/add-or-delete-song-button";
import { AddToPlaylists } from "../../../full-screen-player/ui/molecules/add-to-playlists";

export const SongItemMobileMoreWindow = ({ song }) => {
  const { setContent } = useModal();
  const { currentUser } = useAuth();
  return (
    <div className="SongItemMobileMoreWindow">
      <div
        className="simpleSongElement"
        style={{ background: song.imageColors[0] }}
      >
        <div className="simpleSongElementImage">
          <img loading="lazy" src={song.cover} alt="" />
        </div>
        <span>{song.name}</span>
      </div>
      {currentUser.isAdmin ? (
        <div
          className="songItemMenuWindowItem"
          onClick={() => {
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
      <div
        className="songItemMenuWindowItem"
        onClick={() => setContent(<AddToPlaylists song={song} />)}
      >
        <MdPlaylistAdd />
        Add to playlist
      </div>
      <div
        className="songItemMenuWindowItem"
        onClick={() => {
          setContent(<FriendsToShareWith item={song} whatToShare={"song"} />);
        }}
      >
        <FiShare />
        Share
      </div>
      <div
        className="songItemMenuWindowItem"
        onClick={() => {
          setContent(<SongInfo song={song} />);
        }}
      >
        <FiInfo />
        Info
      </div>
      <div
        className="songItemMenuWindowItem"
        onClick={() => {
          setContent(
            <AuthorsList listOfAuthors={song.authors} title={"Authors"} />
          );
        }}
      >
        <FiUsers />
        Authors
      </div>
    </div>
  );
};
