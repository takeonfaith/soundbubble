import React from "react";
import SearchFilterItem from "../atoms/search-filter-item";

const SearchFilters = ({ defaultSearchMode, searchMode, setSearchMode }) => {
  const filters = ["All", "Songs", "Authors", "Playlists"];
  return (
    <div
      className="searchFilters"
      style={
        defaultSearchMode !== undefined
          ? {
              display: "none",
            }
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
