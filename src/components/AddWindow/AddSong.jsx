import React, { useState } from "react";
import { ColorExtractor } from "react-color-extractor";
import { FiXCircle } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../firebase";
import { findVariantsOfName } from "../../functions/find/findVariantsOfName";
import getUID from "../../functions/other/getUID";
import { transformLyricsToArrayOfObjects } from "../../functions/other/transformLyricsToArrayOfObject";
import DownloadButton from "../../shared/ui/atoms/download-button";
import Input from "../../shared/ui/atoms/input";
import SubmitButton from "../../shared/ui/atoms/submit-button";
import SearchBar from "../../shared/ui/organisms/search-bar";
import { PersonTiny } from "../Basic/PersonTiny";
import { FullScreenLoading } from "../Loading/FullScreenLoading";
export const AddSong = () => {
  const { currentUser } = useAuth();
  const [songName, setSongName] = useState("");
  const [songCover, setSongCover] = useState("");
  const [songSrc, setSongSrc] = useState("");
  const [authorsInputValue, setAuthorsInputValue] = useState("");
  const [allAuthors, setAllAuthors] = useState([]);
  const [chosenAuthors, setChosenAuthors] = useState(
    !currentUser.isAdmin
      ? [
          {
            uid: currentUser.uid,
            photoURL: currentUser.photoURL,
            displayName: currentUser.displayName,
          },
        ]
      : []
  );
  const [releaseDate, setReleaseDate] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [imageLocalPath, setImageLocalPath] = useState("");
  const [imageColors, setImageColors] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loadingSong, setLoadingSong] = useState(false);

  function removeAuthorFromList(data) {
    const filtered = chosenAuthors.filter((people) => people.uid !== data.uid);
    return setChosenAuthors(filtered);
  }

  function addAuthor(data) {
    if (!chosenAuthors.some((person) => person.uid === data.uid)) {
      return setChosenAuthors((prev) => [
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

  async function addSongToFirebase(e) {
    e.preventDefault();

    let uid = getUID();
    setErrorMessage("");
    if (songName.length === 0) setErrorMessage("Song has to have some name");
    else if (chosenAuthors.length === 0)
      setErrorMessage("Song has to have at least 1 author");
    else if (songCover.length === 0)
      setErrorMessage("You didn't load song cover");
    else if (songSrc.length === 0) setErrorMessage("You didn't load song file");
    else if (releaseDate.length === 0)
      setErrorMessage("You have to set release date for a song");
    else {
      setLoadingSong(true);
      firestore
        .collection("songs")
        .doc(uid)
        .set({
          id: uid,
          name: songName,
          songSrc: songSrc,
          authors: chosenAuthors,
          cover: songCover,
          listens: 0,
          releaseDate: releaseDate,
          lyrics: transformLyricsToArrayOfObjects(lyrics),
          imageColors: imageColors,
        })
        .then(() => {
          setAllAuthors([]);
          setAuthorsInputValue("");
          setChosenAuthors([]);
          setLyrics([]);
          setSongCover("");
          setSongName("");
          setSongSrc("");
          setReleaseDate("");
          setLyrics([]);
          setCompleted(true);
          setImageColors([]);
          setLoadingSong(false);
        })
        .catch((err) => {
          setErrorMessage(err);
          setLoadingSong(false);
        });

      chosenAuthors.forEach(async (author) => {
        const authorRef = await firestore
          .collection("users")
          .doc(author.uid)
          .get();
        const authorData = authorRef.data();
        const authorSongs = authorData.ownSongs;
        authorSongs.push(uid);
        firestore.collection("users").doc(author.uid).update({
          ownSongs: authorSongs,
        });
      });

      firestore
        .collection("search")
        .doc(uid)
        .set({
          place: "songs",
          uid: uid,
          rank: 0,
          variantsOfName: findVariantsOfName(songName),
        });
    }
  }

  function manuallyChangeColor(e, i) {
    imageColors[i] = e.target.value;
    setImageColors([...imageColors]);
  }

  return (
    <div className="AddSong">
      <FullScreenLoading loading={loadingSong} />
      <ColorExtractor
        src={imageLocalPath}
        getColors={(colors) => setImageColors(colors)}
      />
      <div>
        <Input
          title={"Song name"}
          value={songName}
          setValue={setSongName}
          placeholder={"Enter song name"}
        />
        <label>
          <h3>Song authors</h3>
          <SearchBar
            value={authorsInputValue}
            setValue={setAuthorsInputValue}
            setResultAuthorList={setAllAuthors}
            defaultSearchMode={"authors"}
            inputText={"Search for authors"}
          />
          <div className="chosenAuthorsList">
            {chosenAuthors.map((author) => {
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
            {allAuthors.map((data, index) => {
              return (
                <PersonTiny
                  data={data}
                  onClick={() => addAuthor(data)}
                  style={
                    chosenAuthors.includes(data.uid)
                      ? { background: "var(--green)" }
                      : {}
                  }
                  key={index}
                />
              );
            })}
          </div>
        </label>

        <Input
          title={"Release Date"}
          type={"date"}
          value={releaseDate}
          setValue={setReleaseDate}
          placeholder={"Enter release date"}
        />

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
        <DownloadButton
          text={"Download song cover"}
          place={"songsImages/"}
          setItemSrc={setSongCover}
          setImageLocalPath={setImageLocalPath}
        />
        <DownloadButton
          text={"Download song file"}
          place={"songs/"}
          setItemSrc={setSongSrc}
        />
        <label>
          <textarea
            name=""
            id=""
            placeholder={"Add song lyrics"}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          ></textarea>
        </label>
        <SubmitButton
          text={"Add song"}
          action={addSongToFirebase}
          isLoading={loadingSong}
          completed={completed}
          setCompleted={setCompleted}
          bottomMessage={"Song was uploaded to database"}
        />
      </div>
    </div>
  );
};
