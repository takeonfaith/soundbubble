import React, { useEffect, useState } from "react";
import { SongList } from "../../../../components/Lists/SongList";
import findIfSongIsNew from "../../../../functions/find/findIfSongIsNew";
import { fetchItemList } from "../../../../shared/lib/fetch-item-list";

export const TopSongs = ({ authorId, authorsData, headerColors }) => {
  const [popularSongs, setPopularSongs] = useState([]);
  const [newSongs, setNewSongs] = useState([]);

  async function findAuthorsSongs() {
    if (authorsData.isAuthor) {
      fetchItemList(authorsData.ownSongs, "songs", setPopularSongs, (res) => {
        res.forEach((songData) => {
          if (findIfSongIsNew(songData) && !newSongs.includes(songData))
            setNewSongs((prevSongs) => [...prevSongs, songData]);
        });
        return res.sort((a, b) => b.listens - a.listens);
      });
    } else {
      fetchItemList(
        authorsData.addedSongs.slice(0).reverse(),
        "songs",
        setPopularSongs
      );
    }
  }

  useEffect(() => {
    findAuthorsSongs();
    setNewSongs([]);
  }, [authorsData.ownSongs]);

  return authorsData.isAuthor ? (
    <div className="TopSongs">
      <SongList
        listOfSongs={newSongs}
        source={{
          source: `/authors/${authorsData.uid}`,
          name: authorsData.displayName,
          image: authorsData.photoURL,
          songsList: newSongs,
        }}
        isNewSong
      />
      <SongList
        listOfSongs={popularSongs}
        source={{
          source: `/authors/${authorsData.uid}`,
          name: authorsData.displayName,
          image: authorsData.photoURL,
          songsList: popularSongs,
        }}
        title={"Popular Songs"}
        showListens
        showCount
        isHorizontal
      />
    </div>
  ) : (
    <SongList
      listOfSongs={popularSongs}
      source={{
        source: `/authors/${authorsData.uid}`,
        name: authorsData.displayName + "'s Library",
        image: authorsData.photoURL,
        songsList: popularSongs,
      }}
      title={authorsData.displayName + "'s Library"}
      showListens
      showCount
      isHorizontal
    />
  );
};
