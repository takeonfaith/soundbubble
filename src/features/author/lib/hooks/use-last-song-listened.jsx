import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSong } from "../../../../contexts/SongContext";
import { firestore } from "../../../../firebase";
import { getSongById } from "../../../../shared/api/song-api";

const useLastSongListened = (data) => {
  const [songData, setSongData] = useState();
  const {
    setCurrentSong,
    currentSong,
    play,
    songRef,
    setPlay,
    setCurrentSongInQueue,
  } = useSong();
  const { currentUser } = useAuth();

  function fetchLastSong() {
    getSongById(data.lastSongPlayed).then((song) => setSongData(song));
  }

  function chooseSongItem() {
    setCurrentSong(songData.id);
    firestore.collection("users").doc(currentUser.uid).update({
      lastSongPlayed: songData.id,
    });
    setCurrentSongInQueue(0);
    if (songData.id === currentSong && play) {
      songRef.current.pause();
      setPlay(false);
      return;
    }
    songRef.current.play();
    setPlay(true);
  }

  useEffect(() => {
    if (data?.lastSongPlayed) fetchLastSong();
  }, [data.lastSongPlayed]);

  return [songData, chooseSongItem];
};

export default useLastSongListened;
