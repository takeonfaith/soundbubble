import React, { useRef, useState } from "react";
import { BiDoorOpen, BiLoaderAlt } from "react-icons/bi";
import { CgCheckO } from "react-icons/cg";
import {
  FiEdit2,
  FiInfo,
  FiMoreVertical,
  FiPlusCircle,
  FiSettings,
  FiShare,
  FiTrash,
  FiUserCheck,
  FiUserPlus,
} from "react-icons/fi";
import { IoMdExit } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/auth";
import { useModal } from "../../../../contexts/modal";
import { useScreen } from "../../../../contexts/screen";
import { useSong } from "../../../../contexts/song";
import { addPlaylistToLibrary } from "../../../../entities/playlist/lib/add-playlist-to-library";
import { deletePlaylist } from "../../../../entities/playlist/lib/delete-playlist";
import { quitPlaylist } from "../../../../entities/playlist/lib/quit-playlist";
import { removePlaylistFromLibrary } from "../../../../entities/playlist/lib/remove-playlist-from-library";
import useOutsideClick from "../../../../shared/lib/hooks/use-outside-click";
import { GoBackBtn } from "../../../../shared/ui/atoms/go-back-button";
import { Hint } from "../../../../shared/ui/atoms/hint";
import { AlbumInfo } from "../../../album/ui/organisms/album-info";
import { CustomizeAlbum } from "../../../album/ui/organisms/customize-album";
import { addAuthorToLibrary } from "../../../author/lib/add-author-to-library";
import addFriend from "../../../author/lib/add-friend";
import deleteAuthorFromLibrary from "../../../author/lib/delete-author-from-library";
import { deleteFriend } from "../../../author/lib/delete-friend";
import { AuthorMoreWindow } from "../../../author/ui/molecules/author-more-window";
import { AuthorInfo } from "../../../author/ui/organisms/author-info";
import { CustomizeAuthor } from "../../../author/ui/organisms/customize-author";
import { FriendsToShareWith } from "../../../share/ui/organisms/friends-to-share-with";

const TopButtons = ({ data, headerColors }) => {
  const { currentUser, logout } = useAuth();
  const { isMobile } = useScreen();
  const { yourSongs } = useSong();
  const [openMoreWindow, setOpenMoreWindow] = useState(false);
  const {
    toggleModal,
    setContent,
    openConfirm,
    closeConfirm,
    openBottomMessage,
  } = useModal();
  const moreWindowRef = useRef(null);
  useOutsideClick(moreWindowRef, setOpenMoreWindow);
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
          <button
            onClick={() => {
              openConfirm(
                "If you unsubscribe from this author, all his tracks will be removed from your library. Are you sure you want to do this?",
                "Yes",
                "No",
                () => {
                  deleteAuthorFromLibrary(data, currentUser, yourSongs);
                  openBottomMessage(
                    `You unsubscribed from ${data.displayName}`
                  );
                  closeConfirm();
                }
              );
            }}
          >
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
        //Зачем здесь этот onClick?
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

  return (
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
                    <FriendsToShareWith
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
  );
};

export default TopButtons;
