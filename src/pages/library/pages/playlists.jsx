import React, { useState } from "react";
import { ContentContainer } from "../../../shared/ui/atoms/content-container";
import { useSong } from "../../../contexts/song";
import { PlaylistItem } from "../../../entities/playlist/ui/playlist-item";
import SearchBar from "../../../shared/ui/organisms/search-bar";
import CreatePlaylist from "../ui/atoms/create-playlist";

const PlaylistsPage = () => {
  const { yourPlaylists } = useSong();
  const [playlistsDisplay, setPlaylistsDisplay] = useState(yourPlaylists);
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
            inputText="Search for playlist name"
          />
        </div>
        <div className="playlistsContainer">
          <CreatePlaylist />
          {playlistsDisplay &&
            playlistsDisplay.map((playlist, index) => {
              return <PlaylistItem playlist={playlist} key={playlist.id} />;
            })}
        </div>
      </ContentContainer>
    </div>
  );
};

export default PlaylistsPage;
