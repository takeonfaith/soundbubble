import React, { useState } from "react";
import { useAuth } from "../../../../contexts/auth";
import { firestore } from "../../../../firebase";
import { findVariationsOfName } from "../../../../shared/lib/find-variations-of-name";
import getUID from "../../../../shared/lib/get-uid";

const useAddPlaylist = () => {
  const { currentUser } = useAuth();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistCover, setPlaylistCover] = useState("");
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
  const [releaseDate, setReleaseDate] = useState(
    currentUser.isAdmin ? "" : new Date().toString()
  );
  const [songsSearch, setSongsSearch] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [chosenSongs, setChosenSongs] = useState([]);
  const [playlistStatus, setPlaylistStatus] = useState(0);
  const [isPlaylistPrivate, setIsPlaylistPrivate] = useState(0);
  const [imageLocalPath, setImageLocalPath] = useState("");
  const [imageColors, setImageColors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [completed, setCompleted] = useState(false);

  function removeAuthorFromList(data) {
    const filtered = chosenAuthors.filter((people) => people.uid !== data.uid);
    return setChosenAuthors(filtered);
  }

  function removeSongFromList(data) {
    const filtered = chosenSongs.filter((song) => song !== data);
    return setChosenSongs(filtered);
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

  async function addPlaylistToFirebase(e) {
    e.preventDefault();
    const uid = getUID();
    if (playlistName.length === 0)
      setErrorMessage("Playlist has to have some name");
    else if (chosenAuthors.length === 0)
      setErrorMessage("Playlist has to have at least 1 author");
    else if (releaseDate.length === 0)
      setErrorMessage("You have to set release date for a playlist");
    else {
      setLoadingPlaylist(true);
      firestore
        .collection("playlists")
        .doc(uid)
        .set({
          id: uid,
          name: playlistName,
          songs: chosenSongs,
          authors: chosenAuthors,
          image: playlistCover,
          listens: 0,
          creationDate: releaseDate,
          subscribers: 0,
          isAlbum: playlistStatus === 1,
          imageColors: imageColors,
          isPrivate: isPlaylistPrivate === true,
        })
        .then(() => {
          setAllAuthors([]);
          setAuthorsInputValue("");
          setChosenAuthors([]);
          setPlaylistCover("");
          setPlaylistName("");
          setReleaseDate("");
          setSongsSearch("");
          setChosenSongs([]);
          setIsPlaylistPrivate(0);
          setLoadingPlaylist(false);
          setCompleted(true);
        })
        .catch((err) => {
          setErrorMessage(err);
          setLoadingPlaylist(false);
        });

      chosenAuthors.forEach(async (author) => {
        const authorRef = await firestore
          .collection("users")
          .doc(author.uid)
          .get();
        const authorData = authorRef.data();
        const authorPlaylists = authorData.ownPlaylists;
        authorPlaylists.push(uid);
        firestore.collection("users").doc(author.uid).update({
          ownPlaylists: authorPlaylists,
        });
      });

      firestore
        .collection("search")
        .doc(uid)
        .set({
          place: "playlists",
          uid: uid,
          rank: 0,
          variantsOfName: findVariationsOfName(playlistName),
        });
    }
  }

  return {
    playlistName,
    setPlaylistName,
    imageLocalPath,
    loadingPlaylist,
    setImageColors,
    authorsInputValue,
    setAuthorsInputValue,
    setAllAuthors,
    chosenAuthors,
    removeAuthorFromList,
    allAuthors,
    addAuthor,
    songsSearch,
    setSongsSearch,
    setAllSongs,
    setPlaylistStatus,
    removeSongFromList,
    chosenSongs,
    allSongs,
    setChosenSongs,
    playlistStatus,
    isPlaylistPrivate,
    setIsPlaylistPrivate,
    setPlaylistCover,
    releaseDate,
    setReleaseDate,
    setImageLocalPath,
    completed,
    setCompleted,
    addPlaylistToFirebase,
    setChosenAuthors,
  };
};

export default useAddPlaylist;
