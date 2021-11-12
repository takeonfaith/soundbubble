import React, { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { firestore } from "../../../../firebase";
import checkNumber from "../../../../shared/lib/check-number";
import { AuthorItemBig } from "../../../author/ui/molecules/author-item-big";
import { LoadingCircle } from "../../../loading/ui/atoms/loading-circle";

import { PlaylistItem } from "../../../../entities/playlist/ui/playlist-item";
import { SongItem } from "../../../../entities/song/ui/song-item";
export const MainBanner = () => {
  const [bannerColors, setBannerColors] = useState([]);
  const [currentSliderPage, setcurrentSliderPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [topAuthor, setTopAuthor] = useState({});
  const [topSong, setTopSong] = useState({});
  const [topAlbum, setTopAlbum] = useState({});

  async function findTop(setFunc, list, criterion) {
    const response = (
      await firestore.collection(list).orderBy(criterion, "desc").limit(1).get()
    ).docs[0].data();
    setFunc(response);
    setBannerColors((prev) => [...prev, response.imageColors[0]]);
    if (list === "playlists") setLoading(false);
  }

  useEffect(() => {
    findTop(setTopAuthor, "users", "subscribers");
    findTop(setTopSong, "songs", "listens");
    findTop(setTopAlbum, "playlists", "listens");
  }, []);
  return (
    <div
      className="MainBanner"
      style={{ background: bannerColors[currentSliderPage] }}
    >
      {loading ? (
        <LoadingCircle />
      ) : (
        <>
          <div className="slider">
            <div
              className={
                "sliderItem " + (currentSliderPage === 0 ? "current" : "")
              }
              style={{ transform: `translateX(-${currentSliderPage * 100}%)` }}
            >
              <h3>Most popular artist on platform</h3>
              <AuthorItemBig data={topAuthor} />
            </div>
            <div
              className={
                "sliderItem " + (currentSliderPage === 1 ? "current" : "")
              }
              style={{ transform: `translateX(-${currentSliderPage * 100}%)` }}
            >
              <h3>Most popular song on platform</h3>
              <SongItem song={topSong} localIndex={0} showListens />
            </div>
            <div
              className={
                "sliderItem " + (currentSliderPage === 2 ? "current" : "")
              }
              style={{ transform: `translateX(-${currentSliderPage * 100}%)` }}
            >
              <h3>Most popular album on platform</h3>
              <PlaylistItem playlist={topAlbum} />
            </div>
          </div>
          <div className="sliderBtns">
            <button
              onClick={() =>
                setcurrentSliderPage(checkNumber(currentSliderPage - 1, 2, 0))
              }
            >
              <BiChevronLeft />
            </button>
            <button
              onClick={() =>
                setcurrentSliderPage(checkNumber(currentSliderPage + 1, 2, 0))
              }
            >
              <BiChevronRight />
            </button>
          </div>
          {/* <BlurredBg circleColor = "#fff"/> */}
        </>
      )}
    </div>
  );
};
