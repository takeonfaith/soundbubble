import { memo } from "react";
import SongItemMoreWindow from "../../../features/song/ui/molecules/song-more-window";
import { useScreen } from "../../../contexts/screen";
import { useSong } from "../../../contexts/song";
import { AddToListCircle } from "../../../shared/ui/molecules/add-to-list-circle";
import useSongLogic from "../lib/hooks/use-song-logic";
import ImageAndName from "./organisms/image-and-name";
import MoreButton from "./organisms/more-button";

export const SongItem = memo(
  ({
    song,
    localIndex,
    showListens = false,
    isNewSong = false,
    listOfChosenSongs,
    setListOfSongs,
    position,
    shouldSaveSearchHistory = false,
  }) => {
    const { isMobile } = useScreen();
    const { currentSong, displayAuthors, play } = useSong();
    const {
      openSongItemMoreWindow,
      chooseSongItem,
      moreWindowPosRelativeToViewport,
      openMoreWindow,
      currentItemRef,
    } = useSongLogic({ song, position, localIndex, shouldSaveSearchHistory });

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
          <ImageAndName
            song={song}
            currentSong={currentSong}
            play={play}
            isMobile={isMobile}
            showListens={showListens}
            displayAuthors={displayAuthors}
            isNewSong={isNewSong}
          />
          <MoreButton
            song={song}
            isMobile={isMobile}
            openSongItemMoreWindow={openSongItemMoreWindow}
          />
          <SongItemMoreWindow
            openMoreWindow={openMoreWindow}
            song={song}
            moreWindowPosRelativeToViewport={moreWindowPosRelativeToViewport}
          />
        </div>
      </div>
    );
  }
);
