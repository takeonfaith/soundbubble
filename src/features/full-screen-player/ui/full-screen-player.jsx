import React, { memo } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { FiMinus } from "react-icons/fi";
import { HiChevronDown } from "react-icons/hi";
import "../../../app/index.css";
import { useScreen } from "../../../contexts/screen";
import { useSong } from "../../../contexts/song";
import { rightSide } from "../../../shared/data/player-right-side";
import useFullScreenPlayer from "../lib/hooks/use-full-screen-player";
import { Player } from "./organisms/player";

const FullScreenPlayer = memo(() => {
  const { inputRef, openFullScreenPlayer } = useSong();
  const { isMobile, screenWidth } = useScreen();
  const {
    deltaY,
    transformTransition,
    refPassthroughBg,
    handlers,
    returnToInitial,
    setOpenFullScreenPlayer,
    openMenu,
    setOpenMenu,
    rightSideCurrentPage,
    noLyrics,
    changeRightSidePage,
    lyricsRef,
    rightSideContent,
    handlersForMobileMenu,
    refPassthroughMobileMenu,
    deltaYMobileMenu,
    mobileMenuTransition,
    mobileContentScroll,
  } = useFullScreenPlayer();

  return (
    <div
      className="bg"
      style={
        openFullScreenPlayer
          ? {
              top: 0,
              opacity: 1,
              visibility: "visible",
              zIndex: 10,
              transform: `translateY(${deltaY}px)`,
              borderRadius: `${deltaY < 20 ? deltaY : 20}px ${
                deltaY < 20 ? deltaY : 20
              }px 0 0`,
              transition: `.4s opacity, ${transformTransition}s transform, .4s top, .4s visibility`,
            }
          : {
              transform: `translateY(${deltaY}px)`,
              transition: `.4s opacity, ${transformTransition}s transform, .4s top, .4s visibility`,
            }
      }
      ref={refPassthroughBg}
      {...handlers}
      onTouchEnd={returnToInitial}
    >
      <div
        className="closeFullScreen"
        onClick={() => {
          setOpenFullScreenPlayer(false);
        }}
      >
        {window.innerWidth > 1000 ? (
          <HiChevronDown />
        ) : (
          <FiMinus style={{ opacity: 0.6 }} />
        )}
      </div>
      <div className="FullScreenPlayer">
        <div
          className="leftSide"
          style={
            !openMenu
              ? { width: "100%" }
              : isMobile
              ? {
                  opacity: 0.6,
                  visibility: "visible",
                  transform: `translateY(20px)`,
                  borderRadius: `10px`,
                  transition: `.4s`,
                }
              : null
          }
        >
          <Player inputRef={inputRef} />
        </div>
        {screenWidth > 1000 ? (
          <div
            className="rightSideWrapper"
            style={
              !openMenu
                ? { transform: "translateX(calc(100% - 90px))", width: 0 }
                : {}
            }
          >
            <button
              className="menuBtn"
              style={
                openMenu
                  ? { transform: "rotate(180deg)" }
                  : { opacity: 0, visibility: "hidden" }
              }
              onClick={() => setOpenMenu(!openMenu)}
            >
              <BiChevronLeft />
            </button>
            <div className="rightSideControl">
              {rightSide.map((el, i) => {
                return (
                  <div
                    className="controlIcon"
                    key={el.id}
                    style={
                      el.id === rightSideCurrentPage && openMenu
                        ? { background: "var(--themeColor)" }
                        : el.id === 2 && noLyrics()
                        ? { opacity: 0.4 }
                        : {}
                    }
                    onClick={() => changeRightSidePage(el)}
                  >
                    {el.icon}
                  </div>
                );
              })}
            </div>
            <div
              className="rightSide"
              ref={lyricsRef}
              style={!openMenu ? { display: "none" } : {}}
            >
              {rightSideContent(rightSideCurrentPage)}
            </div>
          </div>
        ) : (
          <div
            className="mobilePlayerMenu"
            {...handlersForMobileMenu}
            ref={refPassthroughMobileMenu}
            style={
              openMenu
                ? {
                    top: `calc(100% - calc(70vh + 55px) + ${deltaYMobileMenu}px)`,
                    transition: `${mobileMenuTransition}s`,
                  }
                : {
                    top: `calc(100% - 55px + ${deltaYMobileMenu}px)`,
                    transition: `${mobileMenuTransition}s`,
                  }
            }
            // onTouchStart = {returnToInitialMobileMenu}
          >
            <div className="mobilePlayerMenuClose">
              <FiMinus
                style={{ opacity: 0.6, width: "50px" }}
                onClick={() => setOpenMenu(!openMenu)}
              />
            </div>
            <div className="controlIconsWrapper">
              {rightSide.map((el, i) => {
                if (i <= 3) {
                  return (
                    <div
                      className="controlIcon"
                      key={el.id}
                      style={
                        el.id === rightSideCurrentPage && openMenu
                          ? { background: "var(--transparentWhite)" }
                          : el.id === 2 && noLyrics()
                          ? { opacity: 0.4 }
                          : {}
                      }
                      onClick={(e) => changeRightSidePage(el)}
                    >
                      {el.title}
                    </div>
                  );
                }
              })}
            </div>
            <div
              className="mobilePlayerMenuContent"
              ref={mobileContentScroll}
              style={!openMenu ? { opacity: 0 } : {}}
            >
              {rightSideContent(rightSideCurrentPage)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default FullScreenPlayer;
