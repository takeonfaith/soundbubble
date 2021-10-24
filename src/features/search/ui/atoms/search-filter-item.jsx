import React from "react";

const SearchFilterItem = ({ text, searchMode, setSearchMode, index }) => {
  return (
    <button
      onClick={() => setSearchMode(index)}
      style={
        searchMode === index
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
