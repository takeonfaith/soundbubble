import React from "react";
import styled from "styled-components";

const LyricsWrapper = styled.div`
  max-height: 500px;
  width: 1000px;
  overflow-y: auto;

  .lyricsBlock {
    padding: 10px;
    box-sizing: border-box;
    font-size: 1.8em;
    font-weight: 700;
    margin: 10px 0;
    user-select: none;
    cursor: pointer;
    border-radius: var(--standartBorderRadius2);

    &:hover {
      background: #ffffff5c;
    }
  }
`;

const Lyrics = ({ song }) => {
  return (
    <LyricsWrapper>
      {song.lyrics.map((lyricItem, i) => {
        return <div className="lyricsBlock">{lyricItem.text}</div>;
      })}
    </LyricsWrapper>
  );
};

export default Lyrics;
