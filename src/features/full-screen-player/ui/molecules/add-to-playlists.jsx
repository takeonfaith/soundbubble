import React, { useEffect, useState } from "react";
import { AddToPlaylistItem } from "../atoms/add-to-playlist-item";
import { useAuth } from "../../../../contexts/auth";
import { useSong } from "../../../../contexts/song";
export const AddToPlaylists = ({ song }) => {
  const { yourPlaylists, currentSongData } = useSong();
  const { currentUser } = useAuth();

  const [songData, setSongData] = useState(song || currentSongData);
  useEffect(() => {
    if (song?.id) {
      setSongData(song);
    }
  }, [song?.id]);
  return (
    <div className="AddToPlaylists">
      <div style={{ display: "flex", flexDirection: "column" }}>
        {yourPlaylists.length ? (
          yourPlaylists.map((playlist, key) => {
            if (currentUser.ownPlaylists.includes(playlist.id)) {
              return <AddToPlaylistItem playlist={playlist} song={songData} />;
            }
          })
        ) : (
          <div className="songItemMenuWindowItem">No playlists created</div>
        )}
      </div>
    </div>
  );
};
