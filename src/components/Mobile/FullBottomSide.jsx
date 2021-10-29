import React from "react";
import { useSong } from "../../contexts/SongContext";
import { Player } from "../../features/full-screen-player/ui/organisms/player";

import { BottomControlBar } from "./BottomControlBar";

export const FullBottomSide = () => {
  const { setOpenFullScreenPlayer, inputRange } = useSong();
  return (
    <div className="FullBottomSide">
      <span
        onClick={() => setOpenFullScreenPlayer(true)}
        style={{
          display: "block",
          position: "relative",
        }}
      >
        <Player textLimit={25} linkToAuthors={false} />
        <span
          className="mobileSongRange"
          style={{ width: inputRange + "%" }}
        ></span>
      </span>
      <BottomControlBar />
    </div>
  );
};
