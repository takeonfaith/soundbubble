import { useEffect, useState } from "react";
import { firestore } from "../../../../firebase";
import normalizeString from "../../../../functions/other/normalizeString";
import { fetchItemList } from "../../../../shared/lib/fetch-item-list";

const useSearch = (
  value,
  setAllFoundSongs,
  setResultAuthorList,
  setResultPlaylists,
  defaultSearchMode,
  searchMode,
  defaultSongsListValue,
  defaultAuthorsListValue,
  defaultPlaylistsListValue
) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundAnything, setFoundAnything] = useState(false);

  const [inputValue, setInputValue] = useState(value);

  async function findItem(place, defaultList = [], setList) {
    const foundItemTempArray = [];
    let normalizedSearch = normalizeString(value);
    const itemsList = await firestore
      .collection("search")
      .where("variantsOfName", "array-contains", normalizedSearch)
      .get();
    itemsList.docs.forEach(async (item) => {
      const itemData = item.data();
      if (itemData.place === place) {
        const realData = (
          await firestore.collection(itemData.place).doc(itemData.uid).get()
        ).data();
        if (defaultList !== undefined && defaultList.length) {
          if (
            defaultList
              .map((song) => song.id || song.uid)
              .includes(itemData.uid)
          )
            foundItemTempArray.push(realData);
        } else if (!realData.isPrivate) foundItemTempArray.push(realData);
        if (
          defaultSearchMode === undefined &&
          searchMode === 0 &&
          foundItemTempArray.length !== 0
        ) {
          setList(foundItemTempArray);
          switch (itemData.place) {
            case "songs":
              for (let i = 0; i < foundItemTempArray.length; i++) {
                const authorsIdsArray = realData.authors;
                fetchItemList(
                  authorsIdsArray.map((author) => author.uid),
                  "users",
                  setResultAuthorList,
                  (res) => res.sort((a, b) => b.subscribers - a.subscribers),
                  undefined,
                  undefined,
                  1
                );
              }
              break;
            case "users":
              for (let i = 0; i < foundItemTempArray.length; i++) {
                const songsIdsArray = realData.ownSongs;
                const albumsIdsArray = realData.ownPlaylists;
                fetchItemList(
                  songsIdsArray,
                  "songs",
                  setAllFoundSongs,
                  (res) => res.sort((a, b) => b.listens - a.listens),
                  () => null,
                  3,
                  1
                );
                fetchItemList(
                  albumsIdsArray,
                  "playlists",
                  setResultPlaylists,
                  (res) => res.sort((a, b) => b.listens - a.listens),
                  () => null,
                  3,
                  1
                );
              }
              break;
            case "playlists":
              for (let i = 0; i < foundItemTempArray.length; i++) {
                const authorsIdsArray = realData.authors;
                fetchItemList(
                  authorsIdsArray.map((author) => author.uid),
                  "users",
                  setResultAuthorList,
                  (res) => res.sort((a, b) => b.subscribers - a.subscribers),
                  undefined,
                  undefined,
                  1
                );
              }
              break;
            default:
              setMessage("Wrong search mode");
              break;
          }
        }

        if (foundItemTempArray.length !== 0) {
          setLoading(false);
          setFoundAnything(true);
          setList(foundItemTempArray);
        }
      }
    });
    setLoading(false);
    if (foundItemTempArray.length === 0) {
      setList([]);
      setFoundAnything(false);
    }
  }
  function findSomething() {
    if (value.length !== 0) {
      setInputValue(value);
      setLoading(true);
      setFoundAnything(false);
      if (defaultSearchMode === undefined) {
        if (searchMode === 0 || searchMode === 1) {
          findItem("songs", defaultSongsListValue, setAllFoundSongs);
          setResultAuthorList([]);
          setResultPlaylists([]);
        }
        if (searchMode === 0 || searchMode === 2) {
          findItem("users", defaultAuthorsListValue, setResultAuthorList);
          setAllFoundSongs([]);
          setResultPlaylists([]);
        }
        if (searchMode === 0 || searchMode === 3) {
          findItem("playlists", defaultPlaylistsListValue, setResultPlaylists);
          setResultAuthorList([]);
          setAllFoundSongs([]);
        }
      } else {
        switch (defaultSearchMode) {
          case "songs":
            findItem("songs", defaultSongsListValue, setAllFoundSongs);
            break;
          case "playlists":
            findItem(
              "playlists",
              defaultPlaylistsListValue,
              setResultPlaylists
            );
            break;
          case "authors":
            findItem("users", defaultAuthorsListValue, setResultAuthorList);
            break;
          default:
            findItem("songs", defaultSongsListValue, setAllFoundSongs);
            break;
        }
      }
    }
  }

  useEffect(() => {
    if (value.length === 0) {
      if (defaultSongsListValue !== undefined)
        setAllFoundSongs(defaultSongsListValue);
      if (defaultAuthorsListValue !== undefined)
        setResultAuthorList(defaultAuthorsListValue);
      if (defaultPlaylistsListValue !== undefined)
        setResultPlaylists(defaultPlaylistsListValue);
      setLoading(false);
    }
  }, [value]);

  useEffect(() => {
    findSomething();
  }, [searchMode]);

  return {
    findSomething,
    message,
    loading,
    foundAnything,
    inputValue,
    setInputValue,
  };
};

export default useSearch;
