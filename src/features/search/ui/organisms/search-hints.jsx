import React from "react";
import useLoadHints from "../../lib/hooks/use-load-hints";
import SearcHintItem from "../atoms/search-hint-item";

export const SearchHints = ({
  searchValue,
  searchHints,
  setSearchHints,
  currentHint,
  setCurrentHint,
  inputFocused,
  defaultSearchMode,
  findSomething,
  setInputFocused,
}) => {
  useLoadHints({
    setCurrentHint,
    searchValue,
    inputFocused,
    setSearchHints,
  });

  return (
    <div
      className="search-hints"
      style={
        !searchHints.length
          ? { display: "none" }
          : defaultSearchMode
          ? { transform: "translateY(0px)" }
          : { transform: "translateY(-35px)" }
      }
    >
      <SearcHintItem
        name={searchValue}
        type={"search"}
        index={-1}
        key={-1}
        currentHint={currentHint}
        setCurrentHint={setCurrentHint}
        findSomething={findSomething}
        setInputFocused={setInputFocused}
      />
      {searchHints.map((hint, index) => {
        return (
          <SearcHintItem
            {...hint}
            currentHint={currentHint}
            setCurrentHint={setCurrentHint}
            index={index}
            key={hint.uid}
            findSomething={findSomething}
            setInputFocused={setInputFocused}
          />
        );
      })}
    </div>
  );
};
