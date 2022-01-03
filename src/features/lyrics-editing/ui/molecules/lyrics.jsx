import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FiCornerLeftUp, FiCornerRightDown } from "react-icons/fi";
import { Loading } from "../../../full-screen-player/ui/atoms/loading";

const LyricsWrapper = styled.div`
  max-height: 490px;
  width: 1000px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  scroll-behavior: smooth;

  .lyrics-list {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    scroll-snap-type: y mandatory;
    scroll-padding-top: 50px;

    .Loading {
      max-width: 70%;
      width: auto;
    }
  }

  .lyricsBlock {
    padding: 10px;
    box-sizing: border-box;
    font-size: 1.8em;
    font-weight: 700;
    margin: 10px 0;
    user-select: none;
    cursor: pointer;
    border-radius: var(--standartBorderRadius2);
    transform: scale(0.75) translateX(-80px);
    opacity: 0.7;

    &:hover {
      background: #ffffff5c;
    }

    &.current {
      background: #ffffff5c;
      scroll-snap-align: start;
      transform: scale(1) translateX(0);
      opacity: 1;
    }
  }

  .loading-buttons {
    display: flex;
    justify-content: center;
    column-gap: 4px;
    width: 100%;
    min-height: 40px;

    button {
      background: var(--transparentWhite);
      min-height: 100%;
      width: 100%;
      border-radius: var(--standartBorderRadius3);
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        margin-right: 7px;
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const Lyrics = ({
  lyrics,
  setLyrics,
  currentParagraph,
  setCurrentParagraph,
  currentTime,
}) => {
  const [loadingButtons, setLoadingButtons] = useState(null);

  const insertBlock = (index, text) => {
    const temp = lyrics;
    const insertData = { text, startTime: "undefined" };
    if (index === -1) temp.unshift(insertData);
    else if (index === lyrics.length) temp.push(insertData);
    else temp.splice(index, 0, insertData);

    setLyrics([...temp]);
  };

  const handleLyricsBlockClick = (index, text) => {
    if (!!loadingButtons) {
      if (loadingButtons === "before") insertBlock(index, text);
      else insertBlock(index + 1, text);
    }
  };

  const defineCurrentParagraphLight = () => {
    if (
      currentParagraph !== lyrics.length - 1 &&
      parseFloat(lyrics[currentParagraph + 1].startTime) <= currentTime
    ) {
      return setCurrentParagraph(currentParagraph + 1);
    }
  };

  useEffect(() => {
    if (!!lyrics.length) defineCurrentParagraphLight();
  }, [currentTime]);

  return (
    <LyricsWrapper>
      <div className="loading-buttons">
        {!loadingButtons && (
          <>
            <button onClick={() => setLoadingButtons("before")}>
              <FiCornerLeftUp />
              Place loading before
            </button>
            <button onClick={() => setLoadingButtons("after")}>
              <FiCornerRightDown />
              Place loading after
            </button>
          </>
        )}

        {!!loadingButtons && (
          <>
            <h5>Choose block to insert loading {loadingButtons} it</h5>
            <button onClick={() => setLoadingButtons(null)}>Cancel</button>
          </>
        )}
      </div>
      <div className="lyrics-list">
        {lyrics.map((lyricItem, i) => {
          if (lyricItem.text === "@loading")
            return (
              <Loading
                currentTime={currentTime - lyrics[i].startTime}
                timeSpan={lyrics[i + 1].startTime - lyrics[i].startTime}
                id={i}
              />
            );
          else
            return (
              <div
                className={
                  "lyricsBlock " + (currentParagraph === i && "current")
                }
                onClick={() => handleLyricsBlockClick(i, "@loading")}
              >
                {lyricItem.text}
              </div>
            );
        })}
      </div>
    </LyricsWrapper>
  );
};

export default Lyrics;
