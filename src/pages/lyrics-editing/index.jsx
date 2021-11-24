import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ContentContainer } from "../../shared/ui/atoms/content-container";
import Lyrics from "../../features/lyrics-editing/ui/molecules/lyrics";
import SongImageAndName from "../../features/lyrics-editing/ui/molecules/song-image-and-name";
import TimelineWrapper from "../../features/lyrics-editing/ui/molecules/timeline";
import { firestore } from "../../firebase";
import { useSong } from "../../contexts/song";
import { LoadingCircle } from "../../features/loading/ui/atoms/loading-circle";
import checkNumber from "../../shared/lib/check-number";

const LyricsEditingWrapper = styled(ContentContainer)`
  display: flex;
  justify-content: center;
  animation: zoomIn 0.5s forwards;
  align-items: center;
  height: 100%;
  background: ${({ colors }) =>
    `linear-gradient(45deg, ${colors[2]}, ${colors[3]});`};

  .lyrics-central-block {
    display: flex;
    flex-direction: column;
    row-gap: 30px;
  }

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
  const [lyrics, setLyrics] = useState([
    { text: "@loading", startTime: 0 },
    { text: "Better", startTime: 4.641579 },
    { text: "Nothing, baby", startTime: 5.640871 },
    { startTime: 6.639756, text: "Nothing feels better" },
    {
      text: "I'm not really drunk, I never get that fucked up",
      startTime: 11.643213,
    },
    { startTime: 14.393152, text: "I'm not, I'm so sober" },
    {
      text: "Love to see you shine in the night like the diamond you are",
      startTime: 19.133931,
    },
    {
      text: "(Love to see you shine in the night like the diamond you are)",
      startTime: 24.379689,
    },
    {
      startTime: 29.122152,
      text: "I'm good on the side, it's alright, just hold me in the dark",
    },
    {
      text: "(I'm good on the side, it's alright, just hold me in the dark)",
      startTime: 34.127266,
    },
    {
      startTime: 38.618776,
      text: "No one's gotta know what we do, hit me up when you're bored",
    },
    {
      text: "(No one's gotta know what we do, hit me up when you're bored)",
      startTime: 43.868394,
    },
    { text: "'Cause I live down the street", startTime: 48.354129 },
    { text: "So we meet when you need and it's yours", startTime: 50.614509 },
    { startTime: 55.110749, text: "All I hear is..." },
    { startTime: 56.851265, text: "Nothing feels better than this" },
    { text: "Nothing feels better", startTime: 58.856013 },
    { text: "Nothing feels better than this", startTime: 61.608338 },
    { text: "Nothing feels better, oh no", startTime: 64.60475 },
    {
      startTime: 68.105615,
      text: "We don't gotta hide, this is what you like",
    },
    { startTime: 70.595909, text: "I'll admit" },
    { text: "Nothing feels better than this", startTime: 76.091238 },
    {
      text: "You say we're just friends but I swear when nobody's around",
      startTime: 78.349369,
    },
    {
      text: "(You say we're just friends but I swear when nobody's around)",
      startTime: 82.837355,
    },
    {
      startTime: 87.08135,
      text: "You keep my hand around your neck, we connect, are you feeling it now?",
    },
    {
      text: "(You keep my hand around your neck, we connect, are you feeling it now?)",
      startTime: 93.081081,
    },
    { startTime: 94.337571, text: "'Cause I am" },
    {
      startTime: 96.827651,
      text: "I got so high the other night, I swear to God, felt my feet lift the ground",
    },
    {
      text: "(I got so high the other night, I swear to God I felt my feet lift the ground)",
      startTime: 102.834804,
    },
    { startTime: 105.574461, text: "Ooh, yeah" },
    {
      text: "Your back against the wall, this is all you've been talking about",
      startTime: 107.330933,
    },
    { startTime: 113.829185, text: "In my ears" },
    { text: "Nothing feels better than this", startTime: 115.320862 },
    { startTime: 117.812132, text: "Nothing feels better" },
    { text: "Nothing feels better than this", startTime: 120.314059 },
    { startTime: 122.816821, text: "Nothing feels better, oh no" },
    {
      text: "We don't gotta hide, this is what you like",
      startTime: 127.069368,
    },
    { startTime: 131.308451, text: "I admit" },
    { startTime: 134.80945, text: "Nothing feels better than this" },
    { text: "Now, left, right, left, right", startTime: 136.557457 },
    { text: "Take it back, bring it side to side", startTime: 140.05821 },
    { text: "Like that, like that, ayy", startTime: 143.30038 },
    { text: "Ooh, now, left, right, left, right", startTime: 145.794779 },
    { startTime: 149.541102, text: "Take it back, bring it side to side" },
    { startTime: 154.042133, text: "Like" },
    { text: "Nothing feels better than this", startTime: 154.54181 },
    { startTime: 157.035804, text: "Nothing feels better" },
    { text: "Nothing feels better than this", startTime: 159.541697 },
    { startTime: 162.036662, text: "Nothing feels better, oh no" },
    {
      startTime: 166.282294,
      text: "We don't gotta hide, this is what you like",
    },
    { startTime: 169.528565, text: "I admit" },
    {
      text: "Nothing feels better than this (Better than this)",
      startTime: 174.275678,
    },
    { text: "Nothing feels better than thi", startTime: "undefined" },
  ]);
  const [currentParagraph, setCurrentParagraph] = useState(-1);

  const {
    setCurrentSong,
    currentSong,
    play,
    songRef,
    setPlay,
    setCurrentSongInQueue,
    currentTime,
  } = useSong();

  console.log(lyrics);

  const handleKeyDown = (e) => {
    console.log(play);
    if (e.code === "Space") {
      if (!play) {
        chooseSongItem();
      } else {
        if (currentParagraph + 1 === 0) {
          lyrics[currentParagraph + 1].startTime = 0;
          setLyrics([...lyrics]);
          setCurrentParagraph((prev) =>
            checkNumber(prev + 1, lyrics.length - 1)
          );
        } else {
          lyrics[currentParagraph + 1].startTime = currentTime;
          // console.log(lyrics);
          setLyrics([...lyrics]);
          setCurrentParagraph((prev) =>
            checkNumber(prev + 1, lyrics.length - 1)
          );
        }
      }
    }
  };

  useEffect(() => {
    firestore
      .collection("songs")
      .doc(songId)
      .get()
      .then((res) => {
        setSongData(res.data());
        // setLyrics(res.data().lyrics);
      });
  }, []);

  useEffect(() => {
    if (!!lyrics) {
      document.addEventListener("keypress", handleKeyDown);
      return () => {
        document.removeEventListener("keypress", handleKeyDown);
      };
    }
  }, [lyrics, play]);

  const chooseSongItem = () => {
    if (!!songData) {
      setCurrentSong(songData.id);
      setCurrentSongInQueue(0);
      if (songData.id === currentSong && play) {
        songRef.current.pause();
        setPlay(false);
        return;
      }
      songRef.current.play();
      setPlay(true);
    }
  };

  //TODO: Wave visualizer?
  return !!songData ? (
    <LyricsEditingWrapper colors={songData.imageColors} onClick={handleKeyDown}>
      <div className="lyrics-central-block">
        <div className="image-and-lyrics">
          <SongImageAndName
            song={songData}
            chooseSongItem={chooseSongItem}
            play={play}
          />
          <Lyrics
            lyrics={lyrics}
            setLyrics={setLyrics}
            currentParagraph={currentParagraph}
            setCurrentParagraph={setCurrentParagraph}
            currentTime={currentTime}
          />
        </div>
        <TimelineWrapper chooseSongItem={chooseSongItem} />
      </div>
    </LyricsEditingWrapper>
  ) : (
    <LoadingCircle />
  );
};

export default LyricsEditingPage;
