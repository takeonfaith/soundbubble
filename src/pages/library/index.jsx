import React, { useState } from "react";
import "../../styles/LibraryPage.css";
import { SongsPage } from "../../components/LibraryPage/SongsPage";
import { PlaylistsPage } from "../../components/LibraryPage/PlaylistsPage";
import { AuthorsPage } from "../../components/LibraryPage/AuthorsPage";
import { Slider } from "../../shared/ui/molecules/slider";

const LibraryPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const libraryPages = [<SongsPage />, <PlaylistsPage />, <AuthorsPage />];
  return (
    <div className="LibraryPage" style={{ animation: "zoomIn .2s forwards" }}>
      <Slider
        pages={["Songs", "Playlists", "Authors"]}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {libraryPages[currentPage]}
    </div>
  );
};

export default LibraryPage;
