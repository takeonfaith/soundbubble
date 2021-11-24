import React from "react";
import { ColorExtractor } from "react-color-extractor";
import { FiXCircle } from "react-icons/fi";
import { useAuth } from "../../../../contexts/auth";
import { PersonTiny } from "../../../../entities/user/ui/organisms/person-tiny";
import { SongList } from "../../../../features/song/ui/templates/song-list";
import DownloadButton from "../../../../shared/ui/atoms/download-button";
import Input from "../../../../shared/ui/atoms/input";
import { RadioBtn } from "../../../../shared/ui/atoms/radio-button";
import SubmitButton from "../../../../shared/ui/atoms/submit-button";
import SearchBar from "../../../../shared/ui/organisms/search-bar";
import { LoadingCircle } from "../../../loading/ui/atoms/loading-circle";
import useCustomizeAlbum from "../../lib/hooks/use-customize-album";

export const CustomizeAlbum = ({ playlist }) => {
  const { currentUser } = useAuth();
  const {
    imageLocalPath,
    setImageColors,
    playlistName,
    setPlaylistName,
    authorsInputValue,
    setAuthorsInputValue,
    setAllAuthors,
    chosenAuthors,
    removeAuthorFromList,
    loadingAuthors,
    allAuthors,
    addAuthor,
    songsSearch,
    setSongsSearch,
    setAllSongs,
    loadingSongs,
    allSongs,
    chosenSongs,
    setChosenSongs,
    setPlaylistStatus,
    playlistStatus,
    isPlaylistPrivate,
    setIsPlaylistPrivate,
    setPlaylistCover,
    releaseDate,
    setReleaseDate,
    setImageLocalPath,
    addPlaylistToFirebase,
    loading,
    completed,
    setCompleted,
    error,
    setError,
  } = useCustomizeAlbum(playlist);

  return (
    <div className="AddSong">
      <ColorExtractor
        src={imageLocalPath}
        getColors={(colors) => setImageColors(colors)}
      />
      <Input
        title={"Playlist name"}
        value={playlistName}
        setValue={setPlaylistName}
        placeholder="Enter playlist name"
      />
      <div>
        <h3>Playlist authors</h3>
        <SearchBar
          value={authorsInputValue}
          setValue={setAuthorsInputValue}
          setResultAuthorList={setAllAuthors}
          defaultSearchMode={"users"}
          inputText={"Search for authors"}
        />
        <div className="chosenAuthorsList">
          {chosenAuthors.map((author) => {
            return (
              <div className="chosenAuthorItem">
                <span>{author.displayName}</span>
                <FiXCircle
                  onClick={() =>
                    author.uid === currentUser.uid
                      ? null
                      : removeAuthorFromList(author)
                  }
                />
              </div>
            );
          })}
        </div>
        <div className="authorsResult">
          {loadingAuthors ? (
            <div
              style={{ position: "relative", width: "100%", height: "50px" }}
            >
              <LoadingCircle />
            </div>
          ) : (
            allAuthors.map((data, index) => {
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
            })
          )}
        </div>
      </div>

      <label>
        <h3>Search for songs</h3>
        <SearchBar
          value={songsSearch}
          setValue={setSongsSearch}
          setAllFoundSongs={setAllSongs}
          defaultSearchMode={"songs"}
          inputText={"Search for songs"}
        />
        <div className="authorsResult">
          {loadingSongs ? (
            <div
              style={{ position: "relative", width: "100%", height: "50px" }}
            >
              <LoadingCircle />
            </div>
          ) : (
            <SongList
              listOfSongs={allSongs}
              source={"no"}
              listOfChosenSongs={chosenSongs}
              setListOfSongs={setChosenSongs}
            />
          )}
        </div>
      </label>

      {currentUser.isAdmin || currentUser.isAuthor ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            margin: "15px 0",
          }}
        >
          <RadioBtn
            label="Playlist"
            onClick={() => setPlaylistStatus(0)}
            currentActive={playlistStatus}
            id={0}
          />
          <RadioBtn
            label="Album"
            onClick={() => setPlaylistStatus(1)}
            currentActive={playlistStatus}
            id={1}
          />
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          margin: "15px 0",
        }}
      >
        <RadioBtn
          label="Not Private"
          onClick={() => setIsPlaylistPrivate(0)}
          currentActive={isPlaylistPrivate}
          id={0}
        />
        <RadioBtn
          label="Private"
          onClick={() => setIsPlaylistPrivate(1)}
          currentActive={isPlaylistPrivate}
          id={1}
        />
      </div>

      {(currentUser.isAdmin || currentUser.isAuthor) && (
        <Input
          title={"Release Date"}
          type={"date"}
          value={releaseDate}
          setValue={setReleaseDate}
          placeholder={"Enter release date"}
        />
      )}

      <DownloadButton
        text="Download playlist cover"
        place={"songsImages/"}
        setItemSrc={setPlaylistCover}
        setImageLocalPath={setImageLocalPath}
      />

      <SubmitButton
        text={"Update playlist"}
        action={addPlaylistToFirebase}
        isLoading={loading}
        completed={completed}
        setCompleted={setCompleted}
        bottomMessage={"Playlist was updated"}
        errorMessage={error}
        setErrorMessage={setError}
      />
    </div>
  );
};
