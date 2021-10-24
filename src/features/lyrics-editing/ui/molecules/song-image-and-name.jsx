import React from "react";
import styled from "styled-components";

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

const SongImageAndName = ({ song }) => {
  return (
    <SongImageAndNameWrapper>
      <div
        className="song-image"
        style={{ backgroundImage: `url(${song.cover})` }}
      />
      <h3>{song.name}</h3>
    </SongImageAndNameWrapper>
  );
};

export default SongImageAndName;
