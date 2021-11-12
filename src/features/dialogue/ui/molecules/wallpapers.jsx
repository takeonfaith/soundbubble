import React, { useEffect, useState } from "react";
import { LoadingCircle } from "../../../loading/ui/atoms/loading-circle";
import fetchCollection from "../../../../shared/lib/fetch-collection";
import { WallpaperItem } from "../atoms/wallpaper-item";

export const Wallpapers = ({ chatId, currentWallpaper }) => {
  const [wallpapers, setwallpapers] = useState([]);

  useEffect(() => {
    fetchCollection("chatWallpapers").then((res) => setwallpapers(res));
  }, []);

  return !!wallpapers ? (
    <div className="Wallpapers">
      <h2>Wallpapers</h2>
      <div className="wallpapreWrapper">
        <WallpaperItem chatId={chatId} image={"undefined"} />
        {wallpapers.map((wallpaper, index) => {
          return (
            <WallpaperItem
              chatId={chatId}
              image={wallpaper.image}
              key={wallpaper.id}
              currentWallpaper={currentWallpaper}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <LoadingCircle />
  );
};
