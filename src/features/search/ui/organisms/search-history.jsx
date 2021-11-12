import React from "react";
import { AlbumList } from "../../../album/ui/template/album-list";
import { AuthorsList } from "../../../../features/author/ui/templates/authors-list";
import { SongList } from "../../../../features/song/ui/templates/song-list";
import { useAuth } from "../../../../contexts/auth";
import useSearchHistory from "../../lib/hooks/use-search-history.jsx";

const SearchHistory = () => {
  const { searchValue } = useAuth();
  const [historySongs, historyPlaylists, historyAuthors] = useSearchHistory();
  return !searchValue ? (
    <div
      className="search-history"
      style={{ animation: "zoomIn .2s forwards" }}
    >
      <SongList
        listOfSongs={historySongs}
        source={{
          source: "/search",
          name: "Search",
          image:
            "https://www.pngkey.com/png/full/87-872187_lupa-search-icon-white-png.png",
          songsList: historySongs,
        }}
        title={"Search history"}
        showListens
        displayIfEmpty={""}
        isHorizontal
      />
      <AuthorsList listOfAuthors={historyAuthors} />
      <AlbumList listOfAlbums={historyPlaylists} loading={false} />
    </div>
  ) : null;
};

export default SearchHistory;
