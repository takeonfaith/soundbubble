import React from "react";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";
import { TiArrowRepeat, TiArrowShuffle } from "react-icons/ti";
import { useSong } from "../../../../contexts/SongContext";
import displayAuthorsStr from "../../../../functions/display/displayAuthorsStr";
import { findLenOfAuthors } from "../../../../functions/find/findLenOfAuthors";
import correctTimeDisplay from "../../../../functions/other/correctTimeDisplay";
import checkNumber from "../../../../shared/lib/check-number";
import ColorCircles from "../atoms/color-circles";
export const Player = ({ inputRef, textLimit = 18, linkToAuthors = true }) => {
  const {
    currentSongData,
    currentTime,
    changeCurrentTime,
    songDuration,
    setRepeatMode,
    repeatMode,
    play,
    prevSong,
    playSong,
    nextSong,
    setShuffleMode,
    shuffleMode,
    displayAuthors,
    name,
    authors,
    cover,
    inputRange,
  } = useSong();
  return currentSongData.id !== -1 ? (
    <div className="player">
      <div className="playerUpperSide">
        <div className="songCover">
          <img loading="lazy" src={cover} alt="" />
        </div>
        <div className="nameAndAuthors">
          <h2
            title={name.length > textLimit ? name : null}
            style={{ overflow: "hidden" }}
          >
            <div
              style={
                name.length > textLimit
                  ? {
                      animation: "outSideText 17s infinite",
                      whiteSpace: "nowrap",
                    }
                  : {}
              }
            >
              {name}
            </div>
          </h2>
          <h3
            style={{ overflow: "hidden" }}
            title={authors.map((el) => " " + el.displayName)}
          >
            {linkToAuthors ? (
              <div
                style={
                  findLenOfAuthors(currentSongData.authors) > textLimit
                    ? {
                        animation: "outSideText 17s infinite",
                        whiteSpace: "nowrap",
                      }
                    : {}
                }
              >
                {displayAuthors()}
              </div>
            ) : (
              <div>{displayAuthorsStr(authors, " & ", 33)}</div>
            )}
          </h3>
        </div>
      </div>
      <div className="controlPanel">
        <input
          type="range"
          min="0"
          ref={inputRef}
          step="1"
          value={currentTime}
          onChange={(event) => {
            changeCurrentTime(event);
          }}
          style={{
            background: `linear-gradient(to right, var(--themeColor2) ${inputRange}%, #fff ${inputRange}%)`,
          }}
        />
        <div className="startAndEndTime">
          <span>{correctTimeDisplay(currentTime)}</span>
          <span>{correctTimeDisplay(songDuration)}</span>
        </div>
        <div className="btns">
          <button
            className="shuffleBtn"
            onClick={() => setShuffleMode(checkNumber(shuffleMode + 1, 1))}
            style={
              shuffleMode ? { background: "var(--reallyTransparentWhite)" } : {}
            }
          >
            <TiArrowShuffle
              style={shuffleMode ? { color: "var(--themeColor)" } : {}}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSong();
            }}
          >
            <FaBackward />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSong();
            }}
          >
            {play ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSong();
            }}
          >
            <FaForward />
          </button>
          <button
            className="repeatBtn"
            onClick={() => setRepeatMode(checkNumber(repeatMode + 1, 2))}
            style={
              repeatMode ? { background: "var(--reallyTransparentWhite)" } : {}
            }
          >
            <TiArrowRepeat
              style={repeatMode ? { color: "var(--themeColor)" } : {}}
            />
            <span style={repeatMode === 2 ? { opacity: 1 } : {}}></span>
          </button>
          <ColorCircles play={play} />
        </div>
      </div>
    </div>
  ) : null;
};
