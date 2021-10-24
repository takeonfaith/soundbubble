import React, { useState } from "react";
import { useEffect } from "react";
import { ErrorPlate } from "../MessagePlates/ErrorPlate";
import { FiXCircle } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import SearchBar from "../../shared/ui/organisms/search-bar";
import { PersonTiny } from "../Basic/PersonTiny";
import { firestore } from "../../firebase";
import { transformLyricsToArrayOfObjects } from "../../functions/other/transformLyricsToArrayOfObject";
import SubmitButton from "../../shared/ui/atoms/submit-button";
import { useModal } from "../../contexts/ModalContext";
export const EditSong = ({ song }) => {
  const { currentUser } = useAuth();
  const { toggleModal } = useModal();
  const [songName, setSongName] = useState(song.name);
  const [songAuthors, setSongAuthors] = useState(song.authors);
  const [songCover, setSongCover] = useState(song.cover);
  const [imageColors, setImageColors] = useState(song.imageColors);
  const [lyrics, setLyrics] = useState(
    song.lyrics.map((obj) => obj.text).join("\n")
  );
  const [foundAuthors, setFoundAuthors] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setSongName(song.name);
    setSongAuthors(song.authors);
    setSongCover(song.cover);
    setImageColors(song.imageColors);
    setLyrics(song.lyrics.map((obj) => obj.text).join("\n"));
  }, [song.id]);

  function manuallyChangeColor(e, i) {
    imageColors[i] = e.target.value;
    setImageColors([...imageColors]);
  }

  function updateSong() {
    if (songName.length === 0) {
      setErrorMessage("Name shouldn't be empty");
    } else if (songAuthors.length === 0) {
      setErrorMessage("Song has to have at least 1 author");
    } else if (songCover.length === 0) {
      setErrorMessage("Song has to have cover");
    } else {
      setLoading(true);
      if (songAuthors.length > song.authors.length) {
        const newAuthors = songAuthors.filter((author) => {
          return !song.authors.find((a) => a.uid === author.uid);
        });
        newAuthors.forEach(async (author) => {
          const authorRef = await firestore
            .collection("users")
            .doc(author.uid)
            .get();
          const authorData = authorRef.data();
          const authorSongs = authorData.ownSongs;
          authorSongs.push(song.id);
          firestore.collection("users").doc(author.uid).update({
            ownSongs: authorSongs,
          });
        });
      } else if (songAuthors.length < song.authors.length) {
        const newAuthors = song.authors.filter((author) => {
          return !songAuthors.find((a) => a.uid === author.uid);
        });
        newAuthors.forEach(async (author) => {
          const authorRef = await firestore
            .collection("users")
            .doc(author.uid)
            .get();
          const authorData = authorRef.data();
          const authorSongs = authorData.ownSongs;
          const filteredSongs = authorSongs.filter(
            (songId) => songId !== song.id
          );
          firestore.collection("users").doc(author.uid).update({
            ownSongs: filteredSongs,
          });
        });
      }

      firestore
        .collection("songs")
        .doc(song.id)
        .update({
          name: songName,
          authors: songAuthors,
          image: songCover,
          imageColors: imageColors,
          lyrics: transformLyricsToArrayOfObjects(lyrics),
        })
        .then(() => {
          setLoading(false);
          setCompleted(true);
          toggleModal();
        });
    }
  }

  function removeAuthorFromList(data) {
    const filtered = songAuthors.filter((people) => people.uid !== data.uid);
    return setSongAuthors(filtered);
  }
  function addAuthor(data) {
    if (!songAuthors.some((person) => person.uid === data.uid)) {
      return setSongAuthors((prev) => [
        ...prev,
        {
          uid: data.uid,
          displayName: data.displayName,
          photoURL: data.photoURL,
        },
      ]);
    }

    removeAuthorFromList(data);
  }
  return (
    <div>
      <div
        className="SongInfo"
        style={{ flexDirection: "column", marginBottom: "10px" }}
      >
        <h3>Song cover</h3>
        <div style={{ display: "flex" }}>
          <div>
            <img loading="lazy" src={songCover} alt="" className="songImage" />
          </div>
          <div
            style={{
              background: `linear-gradient(-135deg, ${imageColors[0]}, ${imageColors[5]}`,
              width: "100%",
              borderRadius: "var(--standartBorderRadius2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h4 style={{ color: imageColors[1] }}>{songName}</h4>
          </div>
        </div>
      </div>
      <div style={{ width: "100%", display: "flex" }}>
        {imageColors.map((color, index) => {
          return (
            <input
              type="color"
              value={color}
              style={{
                width: "100%",
                height: "60px",
                padding: "0",
                borderRadius: "0px",
              }}
              onChange={(e) => {
                manuallyChangeColor(e, index);
              }}
            />
          );
        })}
      </div>
      <div>
        <h3>Song name</h3>
        <input
          type="text"
          className="standartInput"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
        />
      </div>
      <div>
        <h3>Authors</h3>
        <SearchBar
          value={searchValue}
          setValue={setSearchValue}
          setResultAuthorList={setFoundAuthors}
          defaultSearchMode={"authors"}
        />
        <div className="songAuthorsList">
          {songAuthors.map((author) => {
            return (
              <div className="chosenAuthorItem">
                <span>{author.displayName}</span>
                <FiXCircle
                  onClick={() => {
                    if (currentUser.isAdmin) removeAuthorFromList(author);
                    else if (author.uid !== currentUser.uid)
                      removeAuthorFromList(author);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="authorsResult">
          {foundAuthors.map((data, index) => {
            return (
              <PersonTiny
                data={data}
                onClick={() => addAuthor(data)}
                style={
                  songAuthors.includes(data.uid)
                    ? { background: "var(--green)" }
                    : {}
                }
                key={index}
              />
            );
          })}
        </div>
      </div>
      <div>
        <h3>Lyrics</h3>
        <textarea
          type="text"
          className="standartInput"
          style={{ height: "200px", fontWeight: "500" }}
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
        />
      </div>
      <ErrorPlate errorMessage={errorMessage} />
      <SubmitButton
        text={"Update song"}
        action={updateSong}
        isLoading={loading}
        completed={completed}
        setCompleted={setCompleted}
        bottomMessage={"Song was updated"}
      />
    </div>
  );
};
