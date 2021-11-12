import "../../../app/index.css";
import React, { useState, useRef, useEffect } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { HiChevronDown } from "react-icons/hi";
import { useSong } from "../../../contexts/song";
import { FiMinus } from "react-icons/fi";
import { useSwipeable } from "react-swipeable";
import checkNumber from "../../../shared/lib/check-number";
import { useScreen } from "../../../contexts/screen";
import useOutsideClick from "../../../shared/lib/hooks/use-outside-click";
import { Player } from "./organisms/player";
import { rightSide } from "../../../shared/data/player-right-side";

export default function FullScreenPlayer() {
  const {
    imgColors,
    inputRef,
    rightSideCurrentPage,
    setRightSideCurrentPage,
    openFullScreenPlayer,
    setOpenFullScreenPlayer,
    lyrics,
    openMenu,
    setOpenMenu,
  } = useSong();
  const { isMobile, screenHeight, screenWidth } = useScreen();
  const lyricsRef = useRef(null);
  const [transformTransition, setTransformTransition] = useState(0.05);
  const [mobileMenuTransition, setMobileMenuTransition] = useState(0);
  // const [swipeDown, setSwipeDown] = useState(false)
  const [deltaY, setDeltaY] = useState(0);
  const [deltaYMobileMenu, setDeltaYMobileMenu] = useState(0);
  const mobileContentScroll = useRef();
  // setup ref for your usage
  const mobileMenuRef = React.useRef();
  useOutsideClick(mobileMenuRef, setOpenMenu);
  const handlers = useSwipeable({
    // onSwiped: (eventData) => {setSwipeDown(eventData.dir === 'Down')},
    onSwiping: (event) => {
      if (event.deltaY > 0) setDeltaY(event.deltaY);
    },
  });

  // setup ref for your usage
  const bgRef = React.useRef();

  const handlersForMobileMenu = useSwipeable({
    onSwiping: (event) => {
      event.event.stopPropagation();
      if (
        openMenu &&
        mobileContentScroll.current.scrollTop === 0 &&
        event.deltaY > 0
      )
        setDeltaYMobileMenu(event.deltaY);
      else if (!openMenu && event.deltaY < 0) setDeltaYMobileMenu(event.deltaY);
    },
    onSwipedLeft: () => {
      setRightSideCurrentPage(checkNumber(rightSideCurrentPage + 1, 3));
    },
    onSwipedRight: () => {
      setRightSideCurrentPage(checkNumber(rightSideCurrentPage - 1, 3));
    },
  });

  function returnToInitialMobileMenu() {
    let dropDelta;
    clearTimeout(dropDelta);
    setMobileMenuTransition(0);
    dropDelta = setTimeout(() => {
      setMobileMenuTransition(0.2);
      setDeltaYMobileMenu(0);
    }, 300);
  }

  useEffect(() => {
    if (deltaY > 150) {
      setOpenFullScreenPlayer(false);
    }
  }, [deltaY]);

  useEffect(() => {
    if (!openMenu && deltaYMobileMenu < -100) {
      setOpenMenu(true);
      setDeltaYMobileMenu(0);
      setMobileMenuTransition(0.2);
    } else if (openMenu && deltaYMobileMenu > 150) {
      setOpenMenu(false);
      setDeltaYMobileMenu(0);
      setMobileMenuTransition(0.2);
    } else {
      returnToInitialMobileMenu();
    }
  }, [deltaYMobileMenu]);

  function returnToInitial() {
    let dropDelta;
    clearTimeout(dropDelta);
    setTransformTransition(0.2);
    dropDelta = setTimeout(() => {
      setDeltaY(0);
      setTransformTransition(0);
    }, 100);
  }

  const refPassthroughBg = (el) => {
    handlers.ref(el);
    bgRef.current = el;
  };

  const refPassthroughMobileMenu = (el) => {
    handlersForMobileMenu.ref(el);
    mobileMenuRef.current = el;
  };

  useEffect(() => {
    if (imgColors.length !== 0) {
      document.documentElement.style.setProperty("--themeColor", imgColors[1]);
      document.documentElement.style.setProperty("--themeColor2", imgColors[0]);
      document.documentElement.style.setProperty("--themeColor3", imgColors[2]);
      document.documentElement.style.setProperty("--themeColor4", imgColors[5]);
      document.documentElement.style.setProperty(
        "--themeColorTransparent",
        imgColors[0] + "6e"
      );
    }
  }, [imgColors]);

  function rightSideContent(currentPage) {
    let RightSidePage = rightSide[currentPage].component;
    return <RightSidePage />;
  }

  function noLyrics() {
    return lyrics && lyrics.length === 0;
  }

  function changeRightSidePage(el) {
    if (el.id === 2 && noLyrics()) return null;
    setMobileMenuTransition(0.2);
    setRightSideCurrentPage(el.id);
    setOpenMenu(true);
  }
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
      {/* <div className="auroraWrapper">
        <svg height={screenHeight} width={screenWidth}>
          <defs>
            <filter id="f1" x="0" y="0">
              <feGaussianBlur in="SourceGraphic" stdDeviation="215" />
            </filter>
          </defs>
          <circle cx={screenWidth/2} cy="0" r={screenHeight}
            fill={imgColors[0]} filter="url(#f1)" />
        </svg>
      </div> */}

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
        {window.innerWidth > 1000 ? (
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
}
