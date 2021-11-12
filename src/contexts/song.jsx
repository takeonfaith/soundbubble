import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { LoadingData } from "../features/loading/ui/atoms/loading-vital-data";
import { addSongToHistory } from "../entities/song/lib/add-song-to-history";
import { PersonTiny } from "../entities/user/ui/organisms/person-tiny";
import { firestore } from "../firebase";
import { checkKaraoke } from "../features/full-screen-player/lib/check-karaoke";
import shuffleSongs from "../entities/song/lib/shuffle-songs";
import checkNumber from "../shared/lib/check-number";
import { fetchItemList } from "../shared/lib/fetch-item-list";
import { useConditionFunc } from "../shared/lib/hooks/use-condition-func";
import { useAuth } from "./auth";
import { useModal } from "./modal";

const SongContext = createContext(null);

export const useSong = () => {
  return useContext(SongContext);
};

export const SongProvider = ({ children }) => {
  const { currentUser, loading, setLoading } = useAuth();
  const { setOpenModal } = useModal();
  const [yourSongs, setYourSongs] = useState([]);
  const [yourPlaylists, setYourPlaylists] = useState([]);
  const [yourAuthors, setYourAuthors] = useState([]);
  const [yourFriends, setYourFriends] = useState([]);
  const [currentSongQueue, setCurrentSongQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(-1);
  const [currentSongInQueue, setCurrentSongInQueue] = useState(0);
  const [currentSongPlaylistSource, setCurrentSongPlaylistSource] = useState(
    {}
  );
  const [inputRange, setInputRange] = useState(0);
  const [currentSongData, setCurrentSongData] = useState({ id: -1 });

  const [imgColors, setImgColors] = useState([]);
  const [play, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState(1);
  const [shuffleMode, setShuffleMode] = useState(0);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isThereKaraoke, setIsThereKaraoke] = useState(false);
  const [openFullScreenPlayer, setOpenFullScreenPlayer] = useState(false);
  const songRef = useRef(null);
  const currentParagraphRef = useRef(null);
  const inputRef = useRef(null);
  const leftSideBarInputRef = useRef(null);
  const [rightSideCurrentPage, setRightSideCurrentPage] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);

  function fetchYourFriends() {
    fetchItemList(
      currentUser.friends
        .filter((friend) => friend.status === "added")
        .map((obj) => obj.uid),
      "users",
      setYourFriends
    );
  }

  function fetchQueue() {
    fetchItemList(
      currentUser?.lastQueue?.songsList,
      "songs",
      setCurrentSongQueue,
      (res) => res,
      () =>
        setCurrentSongInQueue(
          currentUser.lastQueue.songsList.findIndex(
            (songId) => songId === currentUser.lastSongPlayed
          )
        )
    );
  }

  function fetchYourSongs() {
    fetchItemList(
      currentUser.addedSongs.slice(0).reverse(),
      "songs",
      setYourSongs,
      (res) => res,
      fetchQueue
    );
  }

  function fetchYourAuthors() {
    fetchItemList(currentUser.addedAuthors, "users", setYourAuthors);
  }

  async function fetchCurrentSongInitial() {
    if (currentUser.uid !== undefined) {
      const tempSongObject = {
        id: -1,
        name: "",
        songSrc: "",
        authors: [],
        cover: "",
        listens: 0,
        releaseDate: "",
        lyrics: [],
        imageColors: [],
      };
      const curSong =
        currentUser.lastSongPlayed ||
        currentUser.addedSongs[0] ||
        tempSongObject.id;
      const curQueue =
        currentUser.lastQueue || {
          source: "/library",
          name: "Your Library",
          image: currentUser.photoURL,
          songsList: yourSongs,
        } ||
        [];
      setCurrentSong(curSong);
      setCurrentSongPlaylistSource(curQueue);

      if (curSong !== -1) {
        const docRef = firestore.collection("songs").doc(curSong);
        const docData = docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              const songData = doc.data();
              setCurrentSongData(songData);
              setImgColors(songData.imageColors || []);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
            setLoading(false);
          });
      } else {
        setCurrentSongData(tempSongObject);
        setImgColors([]);
        setLoading(false);
      }
    }
  }

  async function fetchCurrentSong() {
    if (currentSong !== -1) {
      firestore
        .collection("songs")
        .doc(currentSong)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const songData = doc.data();
            setImgColors(songData.imageColors || []);
            setCurrentSongData(songData);
          }
        });
    } else fetchCurrentSongInitial();
  }

  function fetchYourPlaylists() {
    const tempArray = [];
    if (currentUser.ownPlaylists) {
      currentUser.ownPlaylists.map((playlistId, i) => {
        const response = firestore.collection("playlists").doc(playlistId);
        response
          .get()
          .then((doc) => {
            if (doc.exists) {
              tempArray.push(doc.data());
              if (i === currentUser.ownPlaylists.length - 1)
                setYourPlaylists(tempArray);
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      });
    }

    if (currentUser.addedPlaylists) {
      currentUser.addedPlaylists.map((playlistId, i) => {
        const response = firestore.collection("playlists").doc(playlistId);
        response
          .get()
          .then((doc) => {
            if (doc.exists) {
              tempArray.push(doc.data());
              if (i === currentUser.addedPlaylists.length - 1)
                setYourPlaylists(tempArray);
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      });
    }
  }

  useConditionFunc(
    currentUser,
    fetchYourSongs,
    currentUser.addedSongs &&
      currentUser.addedSongs.length !== yourSongs.length,
    [currentUser.addedSongs]
  );
  useConditionFunc(
    currentUser,
    fetchYourPlaylists,
    currentUser.ownPlaylists &&
      String(currentUser.ownPlaylists.concat(currentUser.addedPlaylists)) !==
        String(yourPlaylists),
    [currentUser.ownPlaylists]
  );
  useConditionFunc(
    currentUser,
    fetchYourFriends,
    currentUser.friends &&
      String(currentUser.friends.filter((obj) => obj.status === "added")) !==
        String(yourFriends),
    [currentUser.friends]
  );
  useConditionFunc(
    currentUser,
    fetchYourAuthors,
    currentUser.addedAuthors &&
      currentUser.addedAuthors.length !== yourAuthors.length,
    [currentUser.addedAuthors]
  );
  useConditionFunc(
    currentUser,
    fetchCurrentSong,
    currentUser &&
      (currentSongData.id === -1 || currentSong || currentUser.lastSongPlayed),
    [currentSong, currentUser.lastSongPlayed]
  );

  useEffect(() => {
    if (currentUser.uid === undefined) {
      setCurrentSongData({ id: -1 });
      setCurrentSong(-1);
      setCurrentSongQueue([]);
      setYourAuthors([]);
      setYourSongs([]);
      setYourFriends([]);
      setYourPlaylists([]);
    }
  }, [currentUser.uid]);

  useEffect(() => {
    setIsThereKaraoke(checkKaraoke(currentSongData.lyrics));
  }, [currentSongData.lyrics]);

  useEffect(() => {
    if (!loading) {
      if (shuffleMode) {
        let shuffledSongsArray = shuffleSongs(currentSongQueue);
        setCurrentSongQueue(shuffledSongsArray);
        setCurrentSongInQueue(
          shuffledSongsArray.findIndex((song) => song.id === currentSong)
        );
      } else {
        setCurrentSongQueue(currentSongPlaylistSource.songsList);
        setCurrentSongInQueue(
          currentSongPlaylistSource.songsList.findIndex(
            (song) => song.id === currentSong
          )
        );
      }
    }
  }, [shuffleMode]);

  function playSong() {
    if (play) {
      songRef.current.pause();
    } else {
      songRef.current.play();
    }

    setPlay(!play);
  }

  useEffect(() => {
    setCurrentParagraph(0);
  }, [currentSongData.id]);

  function loadSongData(e) {
    setCurrentTime(e.target.currentTime);
    setSongDuration(e.target.duration);
    inputRef.current.max = e.target.duration;
    if (window.innerWidth > 1000)
      leftSideBarInputRef.current.max = e.target.duration;
    setInputRange(0);
    if (play) {
      e.target.play();
    } else e.target.pause();
  }

  function defineCurrentParagraph() {
    //Binary Search
    let first = 0,
      last = currentSongData.lyrics.length - 1;
    let roundedTime = parseFloat(
      parseFloat(songRef.current.currentTime).toFixed(1)
    );
    while (first <= last) {
      let midPoint = Math.floor((first + last) / 2);
      let blockStartTime = parseFloat(
        parseFloat(currentSongData.lyrics[midPoint].startTime).toFixed(1)
      );
      let nextBlockStartTime =
        midPoint !== currentSongData.lyrics.length - 1
          ? parseFloat(
              parseFloat(
                currentSongData.lyrics[midPoint + 1].startTime
              ).toFixed(1)
            )
          : last;
      if (currentSongData.lyrics[midPoint].startTime !== "undefined") {
        if (
          roundedTime >= blockStartTime &&
          roundedTime <= nextBlockStartTime
        ) {
          setCurrentParagraph(midPoint);
          break;
        } else if (blockStartTime < roundedTime) first = midPoint + 1;
        else last = midPoint - 1;
      } else return;
    }
  }

  useEffect(() => {
    if (rightSideCurrentPage === 2) defineCurrentParagraph();
  }, [rightSideCurrentPage]);

  function defineCurrentParagraphLight() {
    if (
      currentParagraph !== currentSongData.lyrics.length - 1 &&
      parseFloat(currentSongData.lyrics[currentParagraph + 1].startTime) <=
        songRef.current.currentTime
    ) {
      return setCurrentParagraph(currentParagraph + 1);
    }
  }
  function playing(event) {
    setCurrentTime(event.target.currentTime);
    if (
      isThereKaraoke &&
      rightSideCurrentPage === 2 &&
      openFullScreenPlayer &&
      openMenu
    ) {
      defineCurrentParagraphLight();
    }

    setInputRange((event.target.currentTime / songDuration) * 100);
  }

  async function nextSong() {
    let correctSongNumber = checkNumber(
      currentSongInQueue + 1,
      currentSongQueue.length - 1
    );
    let currentSongId = await (
      await firestore
        .collection("songs")
        .doc(currentSongQueue[correctSongNumber].id)
        .get()
    ).data().id;
    addSongToHistory(currentSongId, currentUser);
    setCurrentParagraph(0);
    setCurrentSong(currentSongId);
    setCurrentSongInQueue(
      checkNumber(correctSongNumber, currentSongQueue.length - 1)
    );
    firestore.collection("users").doc(currentUser.uid).update({
      lastSongPlayed: currentSongId,
    });
  }

  async function prevSong() {
    if (currentTime > 5) {
      songRef.current.currentTime = 0;
      setCurrentTime(0);
      setCurrentParagraph(0);
      return;
    }
    let correctSongNumber = checkNumber(
      currentSongInQueue - 1,
      currentSongQueue.length - 1
    );
    let currentSongId = await (
      await firestore
        .collection("songs")
        .doc(currentSongQueue[correctSongNumber].id)
        .get()
    ).data().id;
    addSongToHistory(currentSongId, currentUser);
    setCurrentParagraph(0);
    setCurrentSong(currentSongId);
    setCurrentSongInQueue(
      checkNumber(correctSongNumber, currentSongQueue.length - 1)
    );
    firestore.collection("users").doc(currentUser.uid).update({
      lastSongPlayed: currentSongId,
    });
  }

  function changeCurrentTime(event, startTime = 0) {
    if (event.target.localName === "div" || event.target.localName === "p") {
      if (startTime !== undefined) {
        setCurrentTime(startTime);
        songRef.current.currentTime = startTime;
        setInputRange((startTime / songDuration) * 100);
        if (
          isThereKaraoke &&
          rightSideCurrentPage === 2 &&
          openFullScreenPlayer
        )
          setCurrentParagraph(parseInt(event.target.id));
        songRef.current.play();
        setPlay(true);
        return;
      }
    } else {
      setCurrentTime(event.target.value);
      songRef.current.currentTime = event.target.value;
      setInputRange((event.target.value / songDuration) * 100);
      if (isThereKaraoke && rightSideCurrentPage === 2 && openFullScreenPlayer)
        defineCurrentParagraph();
    }
  }

  function displayAuthors(
    authorsList = currentSongData.authors,
    separatingSign = " & "
  ) {
    return authorsList.map((el, i) => {
      return (
        <>
          <Link
            to={`/authors/${el.uid}`}
            key={el.uid}
            onClick={(e) => {
              e.stopPropagation();
              setOpenFullScreenPlayer(false);
            }}
          >
            {el.displayName}
          </Link>
          {i === authorsList.length - 1 ? "" : separatingSign}
        </>
      );
    });
  }

  function displayAuthorsFull(
    authorsList = currentSongData.authors,
    separatingSign = " & "
  ) {
    return authorsList.map((el, i) => {
      return (
        <>
          <Link
            to={`/authors/${el.uid}`}
            key={el.uid}
            onClick={(e) => {
              e.stopPropagation();
              setOpenFullScreenPlayer(false);
              setOpenModal(false);
            }}
          >
            <PersonTiny data={el} />
          </Link>
        </>
      );
    });
  }

  useEffect(() => {
    document.title = currentSongData.name || "Soundbubble";
  }, [currentSongData.name]);
  return (
    <SongContext.Provider
      value={{
        yourSongs,
        setYourSongs,
        yourPlaylists,
        yourFriends,
        currentSongQueue,
        currentSongPlaylistSource,
        setCurrentSongPlaylistSource,
        setCurrentSongQueue,
        setCurrentSongInQueue,
        play,
        setPlay,
        songSrc: currentSongData.songSrc,
        currentTime,
        setCurrentTime,
        songDuration,
        songRef,
        name: currentSongData.name,
        authors: currentSongData.authors,
        lyrics: currentSongData.lyrics,
        cover: currentSongData.cover,
        imgColors,
        setImgColors,
        currentSong,
        setCurrentSong,
        repeatMode,
        setRepeatMode,
        shuffleMode,
        setShuffleMode,
        inputRef,
        leftSideBarInputRef,
        isThereKaraoke,
        rightSideCurrentPage,
        currentParagraph,
        currentParagraphRef,
        nextSong,
        prevSong,
        playSong,
        playing,
        defineCurrentParagraph,
        setRightSideCurrentPage,
        changeCurrentTime,
        displayAuthors,
        displayAuthorsFull,
        openFullScreenPlayer,
        setOpenFullScreenPlayer,
        loadSongData,
        fetchYourSongs,
        setOpenMenu,
        openMenu,
        currentSongData,
        setCurrentSongData,
        setIsThereKaraoke,
        setYourPlaylists,
        yourAuthors,
        setYourAuthors,
        inputRange,
      }}
    >
      {!loading ? children : <LoadingData />}
    </SongContext.Provider>
  );
};
