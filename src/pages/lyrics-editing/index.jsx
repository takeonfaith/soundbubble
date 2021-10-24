import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ContentContainer } from "../../components/Containers/ContentContainer";
import Lyrics from "../../features/lyrics-editing/ui/molecules/lyrics";
import SongImageAndName from "../../features/lyrics-editing/ui/molecules/song-image-and-name";
import { firestore } from "../../firebase";

const LyricsEditingWrapper = styled(ContentContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: ${({ colors }) =>
    `linear-gradient(45deg, ${colors[2]}, ${colors[3]});`};

  h2 {
    margin: 0;
  }

  .image-and-lyrics {
    display: flex;
    align-items: center;
  }
`;

const LyricsEditingPage = () => {
  const [songId, setSongId] = useState("3e35c47f-2186-4dea-a415-55616c525874");
  const [songData, setSongData] = useState(null);

  useEffect(() => {
    firestore
      .collection("songs")
      .doc(songId)
      .get()
      .then((res) => {
        setSongData(res.data());
      });
  }, []);

  //TODO: Wave visualizer?
  return (
    !!songData && (
      <LyricsEditingWrapper colors={songData.imageColors}>
        <div>
          <div className="image-and-lyrics">
            <SongImageAndName song={songData} />
            <Lyrics song={songData} />
          </div>
          <div></div>
        </div>
      </LyricsEditingWrapper>
    )
  );
};

export default LyricsEditingPage;
