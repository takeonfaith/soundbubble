import React, { memo, useEffect, useState } from "react";
import { BiFolderPlus, BiFullscreen } from "react-icons/bi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AddPlaylist } from "../../../../features/author/ui/organisms/add-playlist";
import { FriendsToShareWith } from "../../../share/ui/organisms/friends-to-share-with";
import { useAuth } from "../../../../contexts/auth";
import { useModal } from "../../../../contexts/modal";
import { useSong } from "../../../../contexts/song";
import Logo from "../../../../shared/ui/images/Logo3.svg";
import { leftSideBar } from "../../../../shared/data/left-side-bar";
import getShortString from "../../../../shared/lib/get-short-string";
import normalizeString from "../../../../shared/lib/normalize-string";
import { NotificationCircle } from "../../../../shared/ui/atoms/notification-circle";
import "../style.css";
import { Player } from "../../../full-screen-player/ui/organisms/player";
import LeftsideBarContainer from "../atoms/container";
import NavigationPanel from "../molecules/navigation-panel";
import { Person } from "../molecules/person";
import { TinyPlaylist } from "../molecules/tiny-playlist";
import useRenderCount from "../../../../shared/lib/hooks/use-render-count";

export const LeftsideBar = memo(() => {
  const { currentUser } = useAuth();
  const [userNotifications, setUserNotifications] = useState(0);
  const {
    leftSideBarInputRef,
    setOpenFullScreenPlayer,
    currentSongData,
    yourFriends,
    yourPlaylists,
  } = useSong();
  const { toggleModal, setContent } = useModal();
  const [currentFriendToPlaylistPage, setCurrentFriendToPlaylistPage] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(() => {
    let page = leftSideBar.find((el, i) => {
      if (window.location.hash.includes(normalizeString(el.title))) {
        return true;
      }

      return false;
    });
    return page === undefined ? -1 : page.id;
  });

  useEffect(() => {
    setUserNotifications(
      currentUser.friends.reduce((acc, friend) => {
        if (friend.status === "requested") return acc + 1;
        else return acc;
      }, 0)
    );
  }, [JSON.stringify(currentUser.friends)]);

  return (
    <div className="LeftsideBar">
      <div className="logo">
        <img loading="lazy" src={Logo} alt="" />
        <h3>Soundbubble</h3>
      </div>
      <LeftsideBarContainer onClick={() => setCurrentPage(-1)}>
        <Link to={`/authors/${currentUser.uid}`}>
          <div
            className="person"
            style={currentPage === -1 ? { background: "var(--blue)" } : {}}
          >
            <NotificationCircle value={userNotifications} />
            <div
              className="personImg"
              style={{ backgroundImage: `url(${currentUser.photoURL})` }}
            ></div>
            <div className="personName">
              {getShortString(currentUser.displayName, 11)}
            </div>
          </div>
        </Link>
      </LeftsideBarContainer>
      <NavigationPanel
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <LeftsideBarContainer className="leftSideBarContainer friendsAndPlaylists">
        <span
          style={{
            display: !currentFriendToPlaylistPage ? "block" : "none",
            animation: "scrollFromBottom .2s forwards",
          }}
        >
          {yourFriends.length > 0 ? (
            <>
              {yourFriends.map((friend, index) => {
                if (index <= 2) {
                  return <Person index={friend.uid} friend={friend} />;
                }
                return null;
              })}
              <h4
                className="seeMoreBtn"
                onClick={() => {
                  toggleModal();
                  setContent(
                    <FriendsToShareWith
                      item={currentSongData}
                      whatToShare={"song"}
                    />
                  );
                }}
              >
                See more
              </h4>
            </>
          ) : (
            <h4
              style={{
                alignSelf: "center",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No friends added
            </h4>
          )}
        </span>
        <span
          style={{
            display: currentFriendToPlaylistPage ? "block" : "none",
            animation: "scrollFromTop .2s forwards",
          }}
        >
          {yourPlaylists.slice(0, 3).map((playlist, index) => {
            return <TinyPlaylist playlist={playlist} key={playlist.id} />;
          })}
          <button
            className="createPlaylistBtn"
            onClick={() => {
              toggleModal();
              setContent(<AddPlaylist />);
            }}
            style={{ margin: "5px 0" }}
          >
            <BiFolderPlus />
            Create Playlist
          </button>
        </span>
        <div className="upAndDownBtns">
          <button
            onClick={() => setCurrentFriendToPlaylistPage(0)}
            style={!currentFriendToPlaylistPage ? { opacity: "0.3" } : {}}
          >
            <FiChevronUp />
          </button>
          <button
            onClick={() => setCurrentFriendToPlaylistPage(1)}
            style={currentFriendToPlaylistPage ? { opacity: "0.3" } : {}}
          >
            <FiChevronDown />
          </button>
        </div>
      </LeftsideBarContainer>
      <div className="leftSideBarContainer">
        {currentSongData.id === -1 ? null : (
          <div className="littlePlayer">
            <Player textLimit={15} inputRef={leftSideBarInputRef} />
            <div
              className="fullScreenBtn"
              onClick={() => setOpenFullScreenPlayer(true)}
            >
              {/* <Hint text = {"open full screen"} style = {{fontSize:'0.8em'}}/> */}
              <BiFullscreen />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
