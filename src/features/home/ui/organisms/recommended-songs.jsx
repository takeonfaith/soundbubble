import React, { useEffect, useState } from "react";
import { SongList } from "../../../../features/song/ui/templates/song-list";
import { ImportantMessage } from "../../../../shared/ui/atoms/important-message";
import { useAuth } from "../../../../contexts/auth";
import { useSong } from "../../../../contexts/song";
import { firestore } from "../../../../firebase";

export const RecommendedSongs = () => {
  const { yourAuthors } = useSong();
  const { currentUser } = useAuth();
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  function fetchRecommendedSongs() {
    const tempSongsIds = [];
    yourAuthors.forEach((author, i) => {
      author.ownSongs.forEach(async (songId, index) => {
        let songData = (
          await firestore.collection("songs").doc(songId).get()
        ).data();
        if (
          !currentUser.addedSongs.includes(songId) &&
          !tempSongsIds.includes(songData.id) &&
          index <= 3
        ) {
          setRecommendedSongs((prev) => [...prev, songData]);
          tempSongsIds.push(songData.id);
        }
      });
    });
  }

  useEffect(() => {
    fetchRecommendedSongs();
  }, []);
  return (
    <div className="RecommendedSongs">
      <SongList
        listOfSongs={recommendedSongs}
        source={{
          source: `/home`,
          name: "Recommended Songs",
          image: "",
          songsList: recommendedSongs,
        }}
        title={"Recommended Songs"}
        displayIfEmpty={
          <ImportantMessage
            message={
              "No songs recommended. Add favorite authors so we could know what to recommend"
            }
            image={
              "https://i.pinimg.com/originals/b2/3d/f6/b23df649311586e74a8455c92eb3d76b.png"
            }
          />
        }
      />
    </div>
  );
};
