import React, { useEffect, useState } from "react";
import { SongList } from "../../../../features/song/ui/templates/song-list";
import { useSong } from "../../../../contexts/song";
import findIfSongIsNew from "../../../../entities/song/lib/find-if-song-is-new";
import { firestore } from "../../../../firebase";

export const RecentSongs = () => {
  const { yourAuthors } = useSong();
  const [recentSongs, setRecentSongs] = useState([]);
  function findRecentSongs() {
    const tempSongsIds = [];
    yourAuthors.forEach((author, i) => {
      author.ownSongs.forEach(async (songId) => {
        let songData = (
          await firestore.collection("songs").doc(songId).get()
        ).data();
        if (findIfSongIsNew(songData) && !tempSongsIds.includes(songData.id)) {
          setRecentSongs((prev) => [...prev, songData]);
          tempSongsIds.push(songData.id);
        }
      });
    });
  }

  useEffect(() => {
    if (
      yourAuthors !== undefined &&
      yourAuthors.length !== 0 &&
      recentSongs.length === 0
    )
      findRecentSongs();
  }, []);
  return (
    <div>
      <SongList
        listOfSongs={recentSongs}
        source={{
          source: `/home`,
          name: "New Songs",
          image: "",
          songsList: recentSongs,
        }}
        title={"New Songs"}
        isNewSong
      />
    </div>
  );
};
