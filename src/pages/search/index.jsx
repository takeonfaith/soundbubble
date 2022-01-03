import React, { useEffect, useState } from "react";
import SearchBar from "../../shared/ui/organisms/search-bar";
import { ContentContainer } from "../../shared/ui/atoms/content-container";
import { AlbumList } from "../../features/album/ui/template/album-list";
import { AuthorsList } from "../../features/author/ui/templates/authors-list";
import { SongList } from "../../features/song/ui/templates/song-list";
import { useAuth } from "../../contexts/auth";
import SearchHistory from "../../features/search/ui/organisms/search-history";
import "./style.css";

const SearchPage = () => {
  const { searchValue, setSearchValue } = useAuth();
  const [resultSongList, setResultSongList] = useState([]);
  const [resultAuthorList, setResultAuthorList] = useState([]);
  const [resultAlbumList, setResultAlbumList] = useState([]);
  const [shadowColor, setShadowColor] = useState("");
  useEffect(() => {
    setResultSongList([]);
    setResultAuthorList([]);
    setResultAlbumList([]);
  }, [searchValue]);

  useEffect(() => {
    if (resultSongList.length !== 0)
      setShadowColor(resultSongList[0].imageColors[0] + "a6");
    else if (resultAuthorList.length !== 0)
      setShadowColor(resultAuthorList[0].imageColors[0] + "a6");
    else if (resultAlbumList.length !== 0)
      setShadowColor(resultAlbumList[0].imageColors[0] + "a6");
    else setShadowColor("");
  }, [resultSongList, resultAuthorList, resultAlbumList]);

  return (
    <div
      className="SearchPage"
      style={{
        animation: "zoomIn .2s forwards",
      }}
    >
      <ContentContainer>
        <SearchBar
          value={searchValue}
          setValue={setSearchValue}
          allFoundSongs={resultSongList}
          setAllFoundSongs={setResultSongList}
          setResultPlaylists={setResultAlbumList}
          setResultAuthorList={setResultAuthorList}
          focus
        />
        <SearchHistory />
        <SongList
          listOfSongs={resultSongList}
          source={{
            source: "/search",
            name: "Search",
            image:
              "https://www.pngkey.com/png/full/87-872187_lupa-search-icon-white-png.png",
            songsList: resultSongList,
          }}
          title={"Songs"}
          showListens
          saveSearchHistory
          displayIfEmpty={""}
          isHorizontal
        />
        <AuthorsList
          listOfAuthors={resultAuthorList}
          title={"Authors"}
          saveSearchHistory
        />
        <AlbumList
          listOfAlbums={resultAlbumList}
          title={"Albums and Playlists"}
          loading={false}
          saveSearchHistory
        />
        <div
          className="colorfullShadow"
          style={{ background: shadowColor }}
        ></div>
      </ContentContainer>
    </div>
  );
};

export default SearchPage;
