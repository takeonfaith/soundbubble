import React, { memo, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { useModal } from "../../../../contexts/modal";
import { useScreen } from "../../../../contexts/screen";
import { useSong } from "../../../../contexts/song";
import { LibraryPlaylistItem } from "../../../../pages/library/ui/molecules/library-playlist-item";
import Button from "../../../../shared/ui/atoms/button";
import { AddPlaylist } from "../../../author/ui/organisms/add-playlist";
import { findVisiblePlaylists } from "../../lib/find-visible-playlists";
import wave from "../../../../shared/ui/images/wave2.svg";

const Playlists = memo(() => {
  const { yourPlaylists } = useSong();
  const { screenWidth } = useScreen();
  const { toggleModal, setContent } = useModal();
  const playlistsVisible = useMemo(
    () => findVisiblePlaylists(screenWidth),
    [screenWidth]
  );

  return (
    <div className="playLists">
      <div className="playlistContent">
        {yourPlaylists.length ? (
          yourPlaylists.map((p, index) => {
            if (index < playlistsVisible) {
              return <LibraryPlaylistItem playlist={p} key={index} />;
            }
          })
        ) : (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "40%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h3>You don't have playlists</h3>
            <Button
              text="Add playlist"
              icon={<FiPlus />}
              onClick={() => {
                toggleModal();
                setContent(<AddPlaylist />);
              }}
            />
          </div>
        )}
      </div>
      <div className="playlistsBackground">
        <img loading="lazy" src={wave} alt="wave" />
      </div>
    </div>
  );
});

export default Playlists;
