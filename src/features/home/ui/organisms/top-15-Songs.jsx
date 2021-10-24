import React, { useEffect } from "react";
import { useState } from "react";
import { SongList } from "../../../../components/Lists/SongList";
import { LoadingCircle } from "../../../../components/Loading/LoadingCircle";
import { firestore } from "../../../../firebase";

export const Top15Songs = () => {
  const [topSongs, setTopSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  function fetchTopSongs() {
    firestore
      .collection("songs")
      .orderBy("listens", "desc")
      .limit(15)
      .get()
      .then((res) => {
        res.docs.forEach((song) => {
          setTopSongs((prev) => [...prev, song.data()]);
        });
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    fetchTopSongs();
  }, []);
  return !loading ? (
    <SongList
      listOfSongs={topSongs}
      source={{
        source: `/home`,
        name: "Top 15 Songs",
        image:
          "https://media.istockphoto.com/vectors/fire-icon-illustration-for-design-stock-vector-vector-id931601050?k=6&m=931601050&s=170667a&w=0&h=fhRQfwwsW6aXK9OSDM-yj842SFFl2Q9ll6ch-xCK5es=",
        songsList: topSongs,
      }}
      title={"Top 15 Songs"}
      showListens
      showCount
    />
  ) : (
    <LoadingCircle />
  );
};
