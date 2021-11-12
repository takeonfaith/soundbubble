import React from "react";
import Logo from "../../../../shared/ui/images/Logo3.svg";
export const DeletedPlaylist = () => {
  return (
    <div style={{ textDecoration: "none" }} className="playlistWrapper">
      <div
        className="playlistItem"
        style={{
          background: `var(--playlistsColor)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          loading="lazy"
          src={Logo}
          alt=""
          style={{ width: "70px", height: "70px", filter: "grayscale(80%)" }}
        />
      </div>
      <h4 style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
        Playlist was deleted
      </h4>
    </div>
  );
};
