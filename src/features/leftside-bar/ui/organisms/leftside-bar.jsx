import React, { useState } from "react";
import { BiFolderPlus, BiFullscreen } from "react-icons/bi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { NotificationCircle } from "../../../../components/Basic/NotificationCircle";
import { Player } from "../../../../components/FullScreenPlayer/Player";
import { CreatePlaylistPage } from "../../../../components/LibraryPage/CreatePlaylistPage";
import { FriendsListToShareWith } from "../../../../components/Lists/FriendsListToShareWith";
import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import { useSong } from "../../../../contexts/SongContext";
import { leftSideBar } from "../../../../data/leftSideBar";
import normalizeString from "../../../../functions/other/normalizeString";
import shortWord from "../../../../functions/other/shortWord";
import Logo from "../../../../images/Logo3.svg";
import "../../../../styles/LeftsideBar.css";
import NavigationItem from "../atoms/NavigationItem";

import { Person } from "../molecules/Person";
import { TinyPlaylist } from "../molecules/TinyPlaylist";

export const LeftsideBar = () => {
  const { currentUser } = useAuth();
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
  return (
    <div className="LeftsideBar">
      <div className="logo">
        <img loading="lazy" src={Logo} alt="" />
        <h3>Soundbubble</h3>
      </div>
      <div className="leftSideBarContainer" onClick={() => setCurrentPage(-1)}>
        <Link to={`/authors/${currentUser.uid}`}>
          <div
            className="person"
            style={currentPage === -1 ? { background: "var(--blue)" } : {}}
          >
            {currentUser.friends.some(
              (friend) => friend.status === "requested"
            ) ? (
              <NotificationCircle />
            ) : null}
            <div
              className="pesronImg"
              style={{ backgroundImage: `url(${currentUser.photoURL})` }}
            ></div>
            <div className="personName">
              {shortWord(currentUser.displayName, 9)}
            </div>
          </div>
        </Link>
      </div>
      <div className="NavigationPanel">
        {leftSideBar.map(({ id, title, icon, link }, index) => {
          return (
            <NavigationItem
              key={index}
              id={id}
              title={title}
              icon={icon}
              link={link}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          );
        })}
      </div>
      <div className="leftSideBarContainer friendsAndPlaylists">
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
                    <FriendsListToShareWith
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
          {yourPlaylists.map((playlist, index) => {
            if (index <= 2) {
              return <TinyPlaylist playlist={playlist} key={playlist.id} />;
            }
          })}
          <button
            className="createPlaylistBtn"
            onClick={() => {
              toggleModal();
              setContent(<CreatePlaylistPage />);
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
      </div>
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
};
