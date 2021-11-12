import React, { useState } from "react";
import { Slider } from "../../shared/ui/molecules/slider";
import "./ui/style.css";
import { AuthorsPage, PlaylistsPage, SongsPage } from "./pages";

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
