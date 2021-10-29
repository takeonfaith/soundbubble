import React, { useRef, useState } from "react";
import { BiAlbum, BiDoorOpen, BiLoaderAlt } from "react-icons/bi";
import { CgCheckO, CgLock } from "react-icons/cg";
import {
  FiEdit2,
  FiHeadphones,
  FiInfo,
  FiMoreVertical,
  FiPlusCircle,
  FiSettings,
  FiShare,
  FiTrash,
  FiUserCheck,
  FiUserPlus,
} from "react-icons/fi";
import { ImCheckmark } from "react-icons/im";
import { IoMdExit } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { useScreen } from "../../contexts/ScreenContext";
import { useSong } from "../../contexts/SongContext";
import { CustomizeAlbum } from "../../features/album/ui/organisms/customize-album";
import { addAuthorToLibrary } from "../../features/author/lib/add-author-to-library";
import addFriend from "../../features/author/lib/add-friend";
import deleteAuthorFromLibrary from "../../features/author/lib/delete-author-from-library";
import { deleteFriend } from "../../features/author/lib/delete-friend";
import { ChatWithFriendButton } from "../../features/author/ui/molecules/chat-with-friend-button";
import { LastSongListened } from "../../features/author/ui/molecules/last-song-listened";
import { CustomizeAuthor } from "../../features/author/ui/organisms/customize-author";
import { addPlaylistToLibrary } from "../../functions/add/addPlaylistToLibrary";
import { deletePlaylist } from "../../functions/delete/deletePlaylist";
import displayDate from "../../functions/display/displayDate";
import { quitPlaylist } from "../../functions/other/quitPlaylist";
import { removePlaylistFromLibrary } from "../../functions/other/removePlaylistFromLibrary";
import rightFormanForBigNumber from "../../functions/other/rightFormatForBigNumber";
import { useAlbumAuthors } from "../../hooks/useAlbumAuthors";
import useOutsideClick from "../../shared/lib/hooks/use-outside-click";
import { GoBackBtn } from "../../shared/ui/atoms/go-back-button";
import { Hint } from "../Basic/Hint";
import { LastSeen } from "../Basic/LastSeen";
import { AlbumInfo } from "../Info/AlbumInfo";
import { AuthorInfo } from "../Info/AuthorInfo";
import { FriendsListToShareWith } from "../Lists/FriendsListToShareWith";
import { AuthorMoreWindow } from "../Windows/AuthorMoreWindow";
import { SmallImages } from "./SmallImages";
export const Header = ({ data, headerColors }) => {
  const { isMobile } = useScreen();
  const { displayAuthors } = useSong();
  const [albumAuthors, authorsImages] = useAlbumAuthors(data);
  const { currentUser, logout } = useAuth();
  const [openMoreWindow, setOpenMoreWindow] = useState(false);
  const {
    toggleModal,
    setContent,
    openConfirm,
    closeConfirm,
    openBottomMessage,
  } = useModal();
  const isFriend = currentUser.friends.find(
    (friend) => friend.uid === data.uid && friend.status === "added"
  );
  const moreWindowRef = useRef(null);
  useOutsideClick(moreWindowRef, setOpenMoreWindow);

  function displayCreationDateIfExists() {
    return data.creationDate !== undefined ? (
      <div className="headerListenersAndSubsItem">
        <Hint text={"creation date"} style={{ fontSize: "0.8em" }} />
        <span>{displayDate(data.creationDate)}</span>
      </div>
    ) : null;
  }

  function isAlbumOrIsAuthor() {
    return data.authors !== undefined ? (
      data.isAlbum ? (
        <h5>Album</h5>
      ) : (
        <h5>Playlist</h5>
      )
    ) : data.isAuthor ? (
      <h5>Author</h5>
    ) : (
      <h5>
        User{" "}
        {data.authors === undefined && isFriend ? (
          <LastSeen userUID={data.uid} />
        ) : null}
      </h5>
    );
  }

  function showCreatorsIfExist() {
    return data.authors !== undefined ? (
      <div className="headerAuthorsImagesAndNames">
        <SmallImages imagesList={authorsImages} borderColor={headerColors[2]} />
        <div className="headerAuthors">
          {displayAuthors(albumAuthors, ", ")}
        </div>
      </div>
    ) : null;
  }

  function findIfIsVerified() {
    return data.isVerified ? (
      <ImCheckmark style={{ color: headerColors[0] }} />
    ) : null;
  }

  function whatButtonToRender() {
    if (data.authors) {
      if (
        currentUser.ownPlaylists.includes(data.id) &&
        data.authors.length === 1
      )
        return (
          <button
            onClick={() =>
              openConfirm(
                "Are you sure you want to DELETE this playlist forever?!",
                "Yes, pretty sure",
                "No, I Don't!",
                () => {
                  deletePlaylist(data.id);
                  closeConfirm();
                  openBottomMessage(`Playlist ${data.name} was deleted`);
                }
              )
            }
          >
            <Hint text={"delete playlist"} direction={"bottom"} />
            <FiTrash />
          </button>
        );
      else if (currentUser.ownPlaylists.includes(data.id))
        return (
          <button
            onClick={() =>
              openConfirm(
                "Are you sure you want to quit this playlist?",
                "Yes, pretty sure",
                "No, I Don't!",
                () => {
                  quitPlaylist(data, currentUser);
                  closeConfirm();
                  openBottomMessage(`You left ${data.name}`);
                }
              )
            }
          >
            <Hint text={"quit playlist"} direction={"bottom"} />
            <BiDoorOpen />
          </button>
        );
      else if (currentUser.addedPlaylists.includes(data.id))
        return (
          <button
            onClick={() =>
              openConfirm(
                "Are you sure you want to remove this playlist from library?",
                "Yes, pretty sure",
                "No-no-no, go away",
                () => {
                  removePlaylistFromLibrary(data, currentUser);
                  closeConfirm();
                  openBottomMessage("Playlist was removed from library");
                }
              )
            }
          >
            <Hint text={"remove playlist from library"} direction={"bottom"} />
            <CgCheckO />
          </button>
        );
      else
        return (
          <button
            onClick={() => {
              addPlaylistToLibrary(data, currentUser);
              openBottomMessage(`Playlist ${data.name} was added to library`);
            }}
          >
            <Hint text={"add playlist"} direction={"bottom"} />
            <FiPlusCircle />
          </button>
        );
    } else {
      if (currentUser.addedAuthors.includes(data.uid))
        return (
          <button onClick={() => deleteAuthorFromLibrary(data, currentUser)}>
            <Hint text={"delete author from library"} direction={"bottom"} />
            <CgCheckO />
          </button>
        );
      else if (currentUser.uid === data.uid)
        return (
          <Link to={"/settings"}>
            <button>
              <Hint text={"settings"} direction={"bottom"} />
              <FiSettings />
            </button>
          </Link>
        );
      else if (
        !data.isAuthor &&
        currentUser.friends.find(
          (friend) => friend.uid === data.uid && friend.status === "added"
        )
      )
        return (
          <button
            onClick={() =>
              openConfirm(
                `Are you sure you want to unfriend ${data.displayName}?`,
                "Yes, pretty sure",
                "No-no-no, go away",
                () => {
                  deleteFriend(currentUser, data);
                  closeConfirm();
                  openBottomMessage(`${data.displayName} was unfriended`);
                }
              )
            }
          >
            <Hint text={"remove from friend list"} direction={"bottom"} />
            <FiUserCheck />
          </button>
        );
      else if (
        !data.isAuthor &&
        currentUser.friends.find(
          (friend) => friend.uid === data.uid && friend.status === "awaiting"
        )
      )
        return (
          <button onClick={addFriend}>
            <Hint text={"waiting for response"} direction={"bottom"} />
            <BiLoaderAlt style={{ animation: "loading 1s infinite linear" }} />
          </button>
        );
      else if (!data.isAuthor)
        return (
          <button
            onClick={() => {
              addFriend(data, currentUser);
              openBottomMessage(
                `Friend request was sent to ${data.displayName}`
              );
            }}
          >
            <Hint text={"add friend"} direction={"bottom"} />
            <FiUserPlus />
          </button>
        );
      else
        return (
          <button
            onClick={() => {
              addAuthorToLibrary(data, currentUser);
              openBottomMessage(
                `${data.displayName} was added to your library`
              );
            }}
          >
            <Hint text={"subscribe"} direction={"bottom"} />
            <FiPlusCircle />
          </button>
        );
    }
  }

  function findIfIsPrivate() {
    return data.isPrivate ? <CgLock /> : null;
  }

  return (
    <div
      className="Header"
      style={
        headerColors.length
          ? {
              background: `linear-gradient(45deg, ${headerColors[2]}, ${headerColors[0]})`,
            }
          : { background: "var(--yellowAndPinkGrad)" }
      }
    >
      <div className="headerBtns" style={{ background: headerColors[2] }}>
        <GoBackBtn />
        <div style={{ display: "flex" }}>
          <div className="headerBackBtn">{whatButtonToRender()}</div>
          <div className="headerMoreBtn" ref={moreWindowRef}>
            <button
              onClick={
                !isMobile
                  ? () => setOpenMoreWindow(!openMoreWindow)
                  : () => {
                      toggleModal();
                      setContent(<AuthorMoreWindow data={data} />);
                    }
              }
            >
              <Hint text={"more"} direction={"bottom"} />
              <FiMoreVertical />
            </button>
            {openMoreWindow ? (
              <div
                className="songItemMenuWindow"
                style={{ top: "110%", bottom: "auto" }}
                onClick={(e) => e.stopPropagation()}
              >
                {(data.authors &&
                  data.authors.find(
                    (person) => person.uid === currentUser.uid
                  )) ||
                (data.authors && currentUser.isAdmin) ? (
                  <div
                    className="songItemMenuWindowItem"
                    onClick={() => {
                      toggleModal();
                      setContent(<CustomizeAlbum playlist={data} />);
                    }}
                  >
                    <FiEdit2 />
                    Edit
                  </div>
                ) : data.uid === currentUser.uid && !data.isAuthor ? (
                  <div
                    className="songItemMenuWindowItem"
                    onClick={() => {
                      toggleModal();
                      setContent(<CustomizeAuthor author={data} />);
                    }}
                  >
                    <FiEdit2 />
                    Edit
                  </div>
                ) : null}
                <div
                  className="songItemMenuWindowItem"
                  onClick={() => {
                    toggleModal();
                    setContent(
                      <FriendsListToShareWith
                        item={data}
                        whatToShare={
                          data.authors !== undefined ? "playlist" : "author"
                        }
                      />
                    );
                  }}
                >
                  <FiShare />
                  Share
                </div>
                <div
                  className="songItemMenuWindowItem"
                  onClick={() => {
                    toggleModal();
                    setContent(
                      data.authors !== undefined ? (
                        <AlbumInfo album={data} />
                      ) : (
                        <AuthorInfo author={data} />
                      )
                    );
                  }}
                >
                  <FiInfo />
                  Info
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {currentUser.uid === data.uid ? (
          <button
            onClick={() =>
              openConfirm(
                "Are you sure you want to quit?",
                "Yes, pretty sure",
                "No, I Don't!",
                () => {
                  logout();
                  closeConfirm();
                }
              )
            }
          >
            <Hint text={"quit"} direction={"bottom"} />
            <IoMdExit />
          </button>
        ) : null}
      </div>
      <div
        className="headerAuthorsImage"
        style={
          data.authors === undefined
            ? {
                animation: "floatingBorderRadius 10s infinite ease-in-out",
                backgroundImage: `url(${data.photoURL})`,
                position: "relative",
              }
            : {
                backgroundImage: `url(${data.image})`,
                position: "relative",
                backgroundColor: "var(--red)",
              }
        }
      >
        {data.authors !== undefined && !data.image ? (
          <BiAlbum
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "60px",
              height: "60px",
            }}
          />
        ) : null}
      </div>
      <div className="headerAuthorInfo">
        <div className="headerAuthorsName">
          {isAlbumOrIsAuthor()}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "2px 0 10px 0",
            }}
          >
            <>
              <h1>{data.displayName || data.name}</h1>
            </>
            {findIfIsVerified()}
            {findIfIsPrivate()}
            {!!data.displayName && isFriend && (
              <LastSongListened data={data} loading={false} />
            )}
            {/* <LastSongListened data = {data} loading = {loading}/> */}
          </div>
        </div>
        {showCreatorsIfExist()}

        <div className="headerListenersAndSubs">
          <div className="headerListenersAndSubsItem">
            <Hint
              text={
                (data.listens ?? data.numberOfListenersPerMonth) + " listens"
              }
              style={{ fontSize: "0.8em" }}
            />
            <span>
              {rightFormanForBigNumber(
                data.listens ?? data.numberOfListenersPerMonth
              )}
            </span>
            <FiHeadphones />
          </div>
          <div className="headerListenersAndSubsItem">
            <Hint
              text={data.subscribers + " subscribers"}
              style={{ fontSize: "0.8em" }}
            />
            <span>{rightFormanForBigNumber(data.subscribers)}</span>
            <FiUserPlus />
          </div>
          {displayCreationDateIfExists()}
        </div>
        {isFriend ? (
          <ChatWithFriendButton data={data} color={headerColors[3]} />
        ) : null}
      </div>
    </div>
  );
};
