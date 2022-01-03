import React from "react";
import { FiSearch, FiXCircle } from "react-icons/fi";

const SearchBarButtons = (props) => {
  const { length, setInputValue, setValue } = props;
  return (
    <div className="searchBarElement">
      <FiSearch />
      <span
        onClick={() => {
          setValue("");
          setInputValue("");
        }}
        style={
          !length
            ? {
                opacity: 0,
                visibility: "hidden",
                cursor: "default",
              }
            : {}
        }
      >
        <FiXCircle />
      </span>
    </div>
  );
};

export default SearchBarButtons;
