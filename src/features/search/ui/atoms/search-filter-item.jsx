import React from "react";

const SearchFilterItem = ({ text, searchMode, setSearchMode, index }) => {
  return (
    <button
      onClick={() => setSearchMode(text)}
      style={
        searchMode === text
          ? {
              background: "var(--lightBlue)",
            }
          : {}
      }
    >
      {text}
    </button>
  );
};

export default SearchFilterItem;
