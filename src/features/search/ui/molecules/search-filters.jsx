import React from "react";
import SearchFilterItem from "../atoms/search-filter-item";

const SearchFilters = ({
  defaultSearchMode,
  searchMode,
  setSearchMode,
  searchHintsLen,
}) => {
  const filters = ["All", "Songs", "Users", "Playlists"];
  return (
    <div
      className="searchFilters"
      style={
        !!defaultSearchMode
          ? {
              display: "none",
            }
          : searchHintsLen
          ? { background: "var(--leftSideBarColor)" }
          : {}
      }
    >
      {filters.map((filter, index) => {
        return (
          <SearchFilterItem
            text={filter}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default SearchFilters;
