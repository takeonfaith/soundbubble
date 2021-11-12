import React, { useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { useAuth } from "../../../../contexts/auth";
import { leftSideBar } from "../../../../shared/data/left-side-bar";
import normalizeString from "../../../../shared/lib/normalize-string";
import "../style.css";
import { MobileControlBarItem } from "../atoms/mobile-controlbar-item";

export const BottomControlBar = () => {
  const { currentUser } = useAuth();
  const userElement = {
    icon: <BiUserCircle />,
    link: `/authors/${currentUser.uid}`,
  };
  const [currentPage, setCurrentPage] = useState(() => {
    let page = leftSideBar.find((el, i) => {
      if (window.location.hash.includes(normalizeString(el.title))) {
        return true;
      }

      return false;
    });
    return page === undefined ? 0 : page.id;
  });

  return (
    <div className="BottomControlBar">
      {leftSideBar.map((el, i) => {
        return (
          <MobileControlBarItem
            element={el}
            key={i}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        );
      })}
      <MobileControlBarItem
        element={userElement}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
