import React, { useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { useAuth } from "../../contexts/AuthContext";
import normalizeString from "../../functions/other/normalizeString";
import { leftSideBar } from "../../shared/data/left-side-bar";
import "../../styles/BottomControlBar.css";
import { MobileControlBarItem } from "../BottomControlBar/MobileControlBarItem";
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
