import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import styled from "styled-components";
import { useSong } from "../../../../contexts/song";

const SongImageAndNameWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .song-image {
    width: 300px;
    height: 300px;
    background-size: cover;
    background-position: center center;
    border-radius: var(--standartBorderRadius);
  }
`;

const SongImageAndName = ({ song, chooseSongItem, play }) => {
  return (
    <SongImageAndNameWrapper>
      <div
        className="song-image"
        style={{ backgroundImage: `url(${song.cover})` }}
      />
      <div>
        <h3>{song.name}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            chooseSongItem();
          }}
        >
          {play ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </SongImageAndNameWrapper>
  );
};

export default SongImageAndName;
