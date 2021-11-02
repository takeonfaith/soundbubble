import React from "react";
import { ImCheckmark } from "react-icons/im";
import findRightIcon from "../../../../shared/lib/find-right-icon";

const SearcHintItem = (props) => {
  const {
    name,
    author,
    isVerified,
    type,
    index,
    currentHint,
    setCurrentHint,
    findSomething,
    setInputFocused,
  } = props;
  return (
    <div
      className={"search-hint-item" + (currentHint === index ? " current" : "")}
      onClick={() => {
        setCurrentHint(index);
        setInputFocused(false);
        findSomething(name);
      }}
    >
      {findRightIcon(type)}
      <span>{name}</span>
      {author && <span className="search-hint-item-author">{author}</span>}
      {isVerified ? (
        <ImCheckmark
          style={{
            width: "12px",
            height: "12px",
            opacity: 0.5,
            marginLeft: "10px",
          }}
        />
      ) : null}
    </div>
  );
};

export default SearcHintItem;
