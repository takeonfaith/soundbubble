import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSong } from "../../../../contexts/SongContext";
import { firestore } from "../../../../firebase";

const useLastSongListened = (data, loading) => {
  const [lastSongId, setLastSongId] = useState(data.lastSongPlayed);
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
    firestore
      .collection("songs")
      .doc(lastSongId)
      .get()
      .then((doc) => {
        setSongData(doc.data());
      });
  }

  function fetchLastSongId() {
    firestore
      .collection("users")
      .doc(data.uid)
      .onSnapshot((doc) => {
        setLastSongId(doc.data().lastSongPlayed);
      });
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
    fetchLastSong();
  }, [lastSongId]);

  useEffect(() => {
    if (!loading) {
      fetchLastSongId();
      return () => fetchLastSongId();
    }
  }, [firestore]);

  return [songData, chooseSongItem];
};

export default useLastSongListened;
