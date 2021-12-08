import React, { memo } from "react";
import { useAuth } from "../../../contexts/auth";
import { useSong } from "../../../contexts/song";
import Playlists from "../../../features/library/ui/organisms/playlists";
import { SongList } from "../../../features/song/ui/templates/song-list";

const SongsPage = memo(() => {
  const { yourSongs } = useSong();
  const { currentUser } = useAuth();

  return (
    <div className="SongsPage">
      <Playlists />
      <div className="yourSongsList">
        <SongList
          listOfSongs={yourSongs}
          source={{
            source: "/library",
            name: "Your Library",
            image: currentUser.photoURL,
            songsList: yourSongs,
          }}
          showSearch
          showhistory
          displayIfEmpty={<h3>Your library is empty</h3>}
        />
      </div>
    </div>
  );
});

export default SongsPage;
