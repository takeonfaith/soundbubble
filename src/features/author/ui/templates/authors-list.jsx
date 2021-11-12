import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AuthorItemBig } from "../molecules/author-item-big";

export const AuthorsList = ({
  listOfAuthors,
  title = "",
  listOfChosenAuthors,
  setListOfChosenAuthors,
  saveSearchHistory,
}) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const wrapperRef = useRef(null);
  const [shouldRenderRightArrow, setShouldRenderRightArrow] = useState(false);
  function scrollToLeft() {
    const prev = wrapperRef.current.scrollLeft;
    wrapperRef.current.scrollLeft = prev - 200;
    setScrollLeft(prev - 200);
  }
  function scrollToRight() {
    const prev = wrapperRef.current.scrollLeft;
    wrapperRef.current.scrollLeft = prev + 200;
    setScrollLeft(prev + 200);
  }
  useEffect(() => {
    if (listOfAuthors.length > 0) {
      const scrollBiggerThanScreen =
        wrapperRef.current.scrollWidth > wrapperRef.current.offsetWidth;
      if (scrollBiggerThanScreen) setShouldRenderRightArrow(true);
    }
  }, [listOfAuthors]);
  return listOfAuthors.length > 0 ? (
    <div className="AuthorsList">
      {title.length !== 0 ? <h2>{title}</h2> : null}
      <div
        className="authorsWrapper"
        ref={wrapperRef}
        onScroll={(e) => setScrollLeft(e.target.scrollLeft)}
      >
        {listOfAuthors.map((author) => {
          return (
            <AuthorItemBig
              data={author}
              key={author.uid}
              listOfChosenAuthors={listOfChosenAuthors}
              setListOfChosenAuthors={setListOfChosenAuthors}
              shouldSaveSearchHistory={saveSearchHistory}
            />
          );
        })}
      </div>
      <div className="authorsShiftButtons">
        <button
          onClick={scrollToLeft}
          style={scrollLeft <= 0 ? { visibility: "hidden", opacity: "0" } : {}}
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={scrollToRight}
          style={
            shouldRenderRightArrow &&
            wrapperRef.current !== null &&
            wrapperRef.current.scrollWidth - wrapperRef.current.offsetWidth !==
              scrollLeft
              ? {}
              : { visibility: "hidden", opacity: "0" }
          }
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  ) : null;
};
