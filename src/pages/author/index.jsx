import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { useHistory } from "react-router-dom";
import { AddWindow } from "../../components/AdminAndAuthor/AddWindow";
import { Header } from "../../components/AuthorPage/Header";
import { PersonTinyList } from "../../components/AuthorPage/PersonTinyList";
import { Playlists } from "../../components/AuthorPage/Playlists";
import { ContentContainer } from "../../components/Containers/ContentContainer";
import { LoadingCircle } from "../../components/Loading/LoadingCircle";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { FriendRequest } from "../../features/author/ui/molecules/friend-request";
import { TopSongs } from "../../features/author/ui/molecules/top-songs";
import { SimilarArtists } from "../../features/author/ui/organisms/similar-artists";
import { firestore } from "../../firebase";
import "../../styles/AuthorPage.css";

const AuthorPage = () => {
  const match = useRouteMatch("/authors/:authorId");
  const { currentUser } = useAuth();
  const [headerColors, setHeaderColors] = useState([]);
  const { authorId } = match.params;
  const [authorsData, setAuthorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { openBottomMessage } = useModal();
  async function fetchAuthorsData() {
    const response = firestore.collection("users").doc(authorId);
    response
      .get()
      .then((doc) => {
        if (doc.exists) {
          setAuthorsData(doc.data());
          setHeaderColors(doc.data().imageColors);
          setLoading(false);
        } else {
          history.push("/not-found");
        }
      })
      .catch((error) => {
        openBottomMessage("Failed to load author's data", "failure");
      });
  }

  useEffect(() => {
    fetchAuthorsData();
  }, [authorId]);
  return (
    <>
      <div className="AuthorPage" style={{ animation: "zoomIn .2s forwards" }}>
        {loading ? (
          <LoadingCircle />
        ) : (
          <>
            <Header
              data={authorsData}
              headerColors={headerColors}
              setHeaderColors={setHeaderColors}
            />
            <ContentContainer
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                borderRadius: "25px 25px 0 0",
                flex: "auto",
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
              {currentUser.uid === authorsData.uid ? <FriendRequest /> : null}
              <AddWindow data={authorsData} />
              <TopSongs
                author={authorId}
                authorsData={authorsData}
                headerColors={headerColors}
              />
              {authorsData.friends && !authorsData.isAuthor && (
                <PersonTinyList data={authorsData} title={"Friends"} />
              )}
              <Playlists
                authorsData={authorsData}
                headerColors={headerColors}
              />
              {authorsData.isAuthor ? (
                <SimilarArtists data={authorsData} />
              ) : null}
            </ContentContainer>
          </>
        )}
      </div>
    </>
  );
};

export default AuthorPage;
