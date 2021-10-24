import React, { useEffect, useState } from "react";
import SearchBar from "../../shared/ui/organisms/search-bar";
import { ContentContainer } from "../../components/Containers/ContentContainer";
import { AlbumList } from "../../components/Lists/AlbumList";
import { AuthorsList } from "../../components/Lists/AuthorsList";
import { SongList } from "../../components/Lists/SongList";
import { useAuth } from "../../contexts/AuthContext";
import SearchHistory from "../../features/search/ui/organisms/search-history";
import "../../styles/SearchPage.css";

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
