import React, { useRef, useState } from "react";
import { LoadingCircle } from "../../../features/loading/ui/atoms/loading-circle";
import useSearch from "../../../features/search/lib/hooks/use-search";
import rankCurrentHint from "../../../features/search/lib/rank-current-hint";
import SearchBarButtons from "../../../features/search/ui/molecules/search-bar-buttons";
import SearchFilters from "../../../features/search/ui/molecules/search-filters";
import { SearchHints } from "../../../features/search/ui/organisms/search-hints";
import checkNumber from "../../lib/check-number";
import useOutsideClick from "../../lib/hooks/use-outside-click";

const SearchBar = ({
  value,
  setValue,
  setAllFoundSongs,
  setResultPlaylists,
  setResultAuthorList,
  focus = false,
  defaultSearchMode = undefined,
  inputText = "Search for songs or for people",
  defaultSongsListValue,
  defaultAuthorsListValue,
  defaultPlaylistsListValue,
  background,
}) => {
  const [searchMode, setSearchMode] = useState("All");
  const [currentHint, setCurrentHint] = useState(-1);
  const [searchHints, setSearchHints] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);

  const { findSomething, loading, foundAnything, inputValue, setInputValue } =
    useSearch(
      searchHints[currentHint]?.name ?? value,
      setAllFoundSongs,
      setResultAuthorList,
      setResultPlaylists,
      defaultSearchMode,
      searchMode,
      defaultSongsListValue,
      defaultAuthorsListValue,
      defaultPlaylistsListValue
    );

  // useEffect(() => {
  //   if (focus) inputRef.current.focus();
  // }, []);

  const handleCurrentHint = (e) => {
    if (inputFocused) {
      switch (e.key) {
        case "ArrowDown":
          setCurrentHint(
            checkNumber(currentHint + 1, searchHints.length - 1, -1)
          );
          setInputValue(
            searchHints[
              checkNumber(currentHint + 1, searchHints.length - 1, -1)
            ]?.name ?? value
          );
          break;
        case "ArrowUp":
          setCurrentHint(
            checkNumber(currentHint - 1, searchHints.length - 1, -1)
          );
          setInputValue(
            searchHints[
              checkNumber(currentHint - 1, searchHints.length - 1, -1)
            ]?.name ?? value
          );
          break;

        default:
          break;
      }
    }
  };

  useOutsideClick(inputRef, setInputFocused);

  return (
    <div
      style={{ marginTop: "10px", width: "100%" }}
      className="searchBarWrapper"
    >
      <div className="searchBar" ref={inputRef}>
        <SearchBarButtons
          setInputValue={setInputValue}
          length={value.length}
          setValue={setValue}
        />
        <input
          type="text"
          onFocus={() => setInputFocused(true)}
          style={
            searchHints.length
              ? {
                  borderRadius:
                    "var(--standartBorderRadius) var(--standartBorderRadius) 0 0",
                  background: !!background && background,
                }
              : { background: !!background && background }
          }
          placeholder={inputText}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            handleCurrentHint(e);
            if (e.key === "Enter") {
              findSomething();
              // setValue(inputValue);
              rankCurrentHint(
                searchHints[currentHint]?.name,
                searchHints[currentHint]?.uid
              );
              setSearchHints([]);
            }
          }}
        />
        <SearchFilters
          defaultSearchMode={defaultSearchMode}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          searchHintsLen={searchHints.length}
        />
        <SearchHints
          searchValue={value}
          currentHint={currentHint}
          searchHints={searchHints}
          setSearchHints={setSearchHints}
          setCurrentHint={setCurrentHint}
          inputFocused={inputFocused}
          defaultSearchMode={defaultSearchMode || searchMode}
          findSomething={findSomething}
          setInputFocused={setInputFocused}
        />
      </div>
      <div className="authorsResult">
        {loading ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "50px",
              marginTop: "40px",
            }}
          >
            <LoadingCircle />
          </div>
        ) : !foundAnything && value.length !== 0 ? (
          <h2>Not found</h2>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;
