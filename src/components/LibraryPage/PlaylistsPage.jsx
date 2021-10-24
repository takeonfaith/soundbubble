import React, { useState } from "react";
import { BiFolderPlus } from "react-icons/bi";
import { useModal } from "../../contexts/ModalContext";
import { useSong } from "../../contexts/SongContext";
import SearchBar from "../../shared/ui/organisms/search-bar";
import { PlaylistItem } from "../AuthorPage/PlaylistItem";
import { ContentContainer } from "../Containers/ContentContainer";
import { CreatePlaylistPage } from "./CreatePlaylistPage";
export const PlaylistsPage = () => {
  const { yourPlaylists } = useSong();
  const [playlistsDisplay, setPlaylistsDisplay] = useState(yourPlaylists);
  const { toggleModal, setContent } = useModal();
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="PlaylistsPage">
      <ContentContainer>
        <div style={{ display: "flex" }} className="searchAndCreatePlaylist">
          <SearchBar
            value={searchValue}
            setValue={setSearchValue}
            setResultPlaylists={setPlaylistsDisplay}
            defaultSearchMode={"playlists"}
            defaultPlaylistsListValue={yourPlaylists}
          />
          <button
            className="createPlaylistBtn"
            onClick={() => {
              toggleModal();
              setContent(<CreatePlaylistPage />);
            }}
          >
            <BiFolderPlus />
            Create Playlist
          </button>
        </div>
        <div className="playlistsContainer">
          {playlistsDisplay &&
            playlistsDisplay.map((playlist, index) => {
              return <PlaylistItem playlist={playlist} key={playlist.id} />;
            })}
        </div>
      </ContentContainer>
    </div>
  );
};
