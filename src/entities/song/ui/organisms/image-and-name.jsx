import React, { memo } from "react";
import { HiPause, HiPlay } from "react-icons/hi";
import { useScreen } from "../../../../contexts/screen";
import ColorCircles from "../../../../features/full-screen-player/ui/atoms/color-circles";
import displayAuthorsStr from "../../../../shared/lib/display-authors-str";

import getShortString from "../../../../shared/lib/get-short-string";
import ShowAdditionInfo from "../molecules/show-additional-info";

const ImageAndName = memo(
  ({
    song,
    currentSong,
    play,
    isMobile,
    showListens,
    displayAuthors,
    isNewSong,
  }) => {
    const { screenWidth } = useScreen();

    return (
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
          <img src={song.cover} alt="" loading="lazy" />
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
            <div className="songItemAuthor">{displayAuthors(song.authors)}</div>
          ) : (
            <div
              className="songItemAuthor"
              style={{ maxWidth: screenWidth - 180 }}
            >
              {displayAuthorsStr(song.authors, " & ", 130)}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ImageAndName;
