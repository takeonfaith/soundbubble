import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/auth";
import { findAuthorsAlbums } from "../../lib/find-authors-albums";
import { AlbumList } from "../../../album/ui/template/album-list";

export const Playlists = ({ authorsData }) => {
  const { currentUser } = useAuth();
  const [authorsPlaylists, setAuthorsPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findAuthorsAlbums(
      authorsData,
      setAuthorsPlaylists,
      currentUser.uid,
      setLoading
    );
  }, [authorsData.ownPlaylists]);

  return (
    <AlbumList
      listOfAlbums={authorsPlaylists}
      title={currentUser.isAuthor ? "Albums" : "Playlists"}
      loading={loading}
    />
  );
};
