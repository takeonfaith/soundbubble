import { useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { HiPause, HiPlay } from "react-icons/hi";
import { Hint } from "../../../../components/Basic/Hint";
import { SongItemMobileMoreWindow } from "../../../../components/Windows/SongItemMobileMoreWindow";
import SongItemMoreWindow from "../../../../components/Windows/SongItemMoreWindow";
import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import { useScreen } from "../../../../contexts/ScreenContext";
import { useSong } from "../../../../contexts/SongContext";
import { firestore } from "../../../../firebase";
import { addSongToHistory } from "../../../../functions/add/addSongToHistory";
import displayAuthorsStr from "../../../../functions/display/displayAuthorsStr";
import getShortString from "../../../../shared/lib/get-short-string";
import useOutsideClick from "../../../../shared/lib/hooks/use-outside-click";
import { AddToListCircle } from "../../../../shared/ui/molecules/add-to-list-circle";
import ColorCircles from "../../../full-screen-player/ui/atoms/color-circles";

import saveSearchHistory from "../../../search/lib/save-search-history";
import AddOrDeleteButton from "../molecules/add-or-delete-button";
import ShowAdditionInfo from "../molecules/show-additional-info";
export const SongItem = ({
  song,
  localIndex,
  showListens = false,
  isNewSong = false,
  listOfChosenSongs,
  setListOfSongs,
  position,
  shouldSaveSearchHistory = false,
}) => {
  const {
    setCurrentSong,
    currentSong,
    displayAuthors,
    play,
    songRef,
    setPlay,
    setCurrentSongInQueue,
  } = useSong();
  const { isMobile } = useScreen();
  const [openMoreWindow, setOpenMoreWindow] = useState(false);
  const [moreWindowPosRelativeToViewport, setMoreWindowPosRelativeToViewport] =
    useState(0);
  const currentItemRef = useRef(null);
  const { currentUser } = useAuth();
  const { toggleModal, setContent } = useModal();
  useOutsideClick(currentItemRef, setOpenMoreWindow);

  function chooseSongItem() {
    setCurrentSong(song.id);
    firestore.collection("users").doc(currentUser.uid).update({
      lastSongPlayed: song.id,
    });

    setCurrentSongInQueue(localIndex);
    if (song.id === currentSong && play) {
      songRef.current.pause();
      setPlay(false);
      // clearTimeout(listenCountTimeOut)
      return;
    }
    songRef.current.play();
    setPlay(true);

    if (shouldSaveSearchHistory)
      saveSearchHistory(currentUser.uid, song.id, "songs");
    addSongToHistory(song.id, currentUser);
  }

  function openSongItemMoreWindow(e) {
    e.stopPropagation();
    setOpenMoreWindow(!openMoreWindow);
    setMoreWindowPosRelativeToViewport(
      position || e.target.getBoundingClientRect().top
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <AddToListCircle
        listOfChosenItems={listOfChosenSongs}
        setListOfChosenItems={setListOfSongs}
        itemId={song.id}
      />
      <div
        className={
          "SongItem " + (song.id === currentSong && play ? "playingNow" : "")
        }
        onClick={chooseSongItem}
        ref={openMoreWindow ? currentItemRef : null}
        style={openMoreWindow ? { background: "var(--playlistsColor)" } : {}}
      >
        <div className="songItemImageAndName">
          <div className="songItemImage">
            <div className="songItemPlayOrPause">
              {song.id === currentSong && play ? null : <HiPlay />}
            </div>
            <div
              className="playingAnimation"
              style={
                song.id === currentSong && play
                  ? { opacity: 1, visibility: "visible" }
                  : {}
              }
            >
              <HiPause />
              <ColorCircles play={play} />
            </div>
            <img loading="lazy" src={song.cover} alt="" />
          </div>
          <div className="songItemNameAndAuthor">
            <div
              className="songItemName"
              style={{ display: "flex", alignItems: "center" }}
            >
              {getShortString(song.name, !isMobile ? 30 : 17)}
              <span style={{ marginLeft: "10px", fontWeight: "500" }}>
                <ShowAdditionInfo
                  showListens={showListens}
                  isNewSong={isNewSong}
                  song={song}
                />
              </span>
            </div>
            {!isMobile ? (
              <div className="songItemAuthor">
                {displayAuthors(song.authors)}
              </div>
            ) : (
              <div className="songItemAuthor">
                {displayAuthorsStr(song.authors, " & ", 30)}
              </div>
            )}
          </div>
        </div>
        <div className="songItemMoreBtn">
          <AddOrDeleteButton song={song} />
          <button
            onClick={
              isMobile
                ? (e) => {
                    e.stopPropagation();
                    toggleModal();
                    setContent(<SongItemMobileMoreWindow song={song} />);
                  }
                : openSongItemMoreWindow
            }
          >
            <Hint text={"more"} />
            <FiMoreVertical />
          </button>
        </div>
        <SongItemMoreWindow
          openMoreWindow={openMoreWindow}
          song={song}
          moreWindowPosRelativeToViewport={moreWindowPosRelativeToViewport}
        />
      </div>
    </div>
  );
};
