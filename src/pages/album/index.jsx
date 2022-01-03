import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { useHistory } from "react-router-dom";
import { LoadingCircle } from "../../features/loading/ui/atoms/loading-circle";
import { SongList } from "../../features/song/ui/templates/song-list";
import { Header } from "../../features/template-header/header";
import { firestore } from "../../firebase";
import { fetchItemList } from "../../shared/lib/fetch-item-list";
import { ContentContainer } from "../../shared/ui/atoms/content-container";

const AlbumPage = () => {
  const match = useRouteMatch("/albums/:albumId");
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [headerColors, setHeaderColors] = useState([]);
  const { albumId } = match.params;
  const [albumData, setAlbumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  async function fetchAlbumsData() {
    firestore
      .collection("playlists")
      .doc(albumId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setAlbumData(doc.data());
          setHeaderColors(doc.data().imageColors);
        } else {
          history.push("/not-found");
        }
      });
  }

  function fetchSongsInAlbum() {
    if (albumData.songs?.length)
      fetchItemList(
        albumData.songs,
        "songs",
        setPlaylistSongs,
        (res) => res,
        () => setLoading(false)
      );
    else setLoading(false);
  }

  useEffect(() => {
    fetchAlbumsData();
  }, [albumId, firestore]);

  useEffect(() => {
    fetchSongsInAlbum();
  }, [albumData]);

  return (
    <div className="AlbumPage" style={{ animation: "zoomIn .2s forwards" }}>
      {loading ? (
        <LoadingCircle top={"50%"} />
      ) : (
        <>
          <Header
            data={albumData}
            headerColors={headerColors}
            setHeaderColors={setHeaderColors}
          />
          <ContentContainer
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100%",
              borderRadius: "25px 25px 0 0",
              flex: "1 1 auto",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0px 0px 100px #060606",
            }}
          >
            <div
              className="content-background"
              style={{
                background: `linear-gradient(360deg, black, ${headerColors[0]})`,
              }}
            ></div>
            <SongList
              listOfSongs={playlistSongs}
              source={{
                source: `/albums/${albumData.id}`,
                name: albumData.name,
                image: albumData.image,
                songsList: playlistSongs,
              }}
              showSearch
              defaultSearchMode={"songs"}
              displayIfEmpty={"No songs"}
            />
          </ContentContainer>
        </>
      )}
    </div>
  );
};

export default AlbumPage;
