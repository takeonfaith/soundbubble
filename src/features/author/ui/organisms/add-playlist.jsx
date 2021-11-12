import React, { useState } from "react";
import { ColorExtractor } from "react-color-extractor";
import { FiXCircle } from "react-icons/fi";
import { useAuth } from "../../../../contexts/auth";
import { useSong } from "../../../../contexts/song";
import { SongItem } from "../../../../entities/song/ui/song-item";
import { PersonTiny } from "../../../../entities/user/ui/organisms/person-tiny";
import { firestore } from "../../../../firebase";
import { findVariationsOfName } from "../../../../shared/lib/find-variations-of-name";
import getUID from "../../../../shared/lib/get-uid";
import DownloadButton from "../../../../shared/ui/atoms/download-button";
import Input from "../../../../shared/ui/atoms/input";
import { RadioBtn } from "../../../../shared/ui/atoms/radio-button";
import SubmitButton from "../../../../shared/ui/atoms/submit-button";
import SearchBar from "../../../../shared/ui/organisms/search-bar";
import { FullScreenLoading } from "../../../loading/ui/atoms/full-screen-loading";
import useAddPlaylist from "../../lib/hooks/use-add-playlist";
import { PersonTinyList } from "../templates/person-tiny-list";
import { TinyPersonsList } from "../templates/tiny-persons-list";

export const AddPlaylist = () => {
  const { currentUser } = useAuth();
  const { yourFriends } = useSong();

  const {
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
  } = useAddPlaylist();

  return (
    <div className="AddSong">
      <FullScreenLoading loading={loadingPlaylist} />
      <ColorExtractor
        src={imageLocalPath}
        getColors={(colors) => setImageColors(colors)}
      />
      <div>
        <Input
          title={"Playlist name"}
          value={playlistName}
          setValue={setPlaylistName}
          placeholder={"Enter playlist name"}
        />
        <label>
          <h3>Playlist authors</h3>
          <SearchBar
            value={authorsInputValue}
            setValue={setAuthorsInputValue}
            setResultAuthorList={setAllAuthors}
            defaultSearchMode={"authors"}
            defaultAuthorsListValue={yourFriends}
            inputText={"Search for authors"}
          />
          <TinyPersonsList
            listOfPeople={allAuthors}
            restriction={3}
            chosenArray={chosenAuthors}
            setChosenArray={setChosenAuthors}
          />
        </label>

        <label>
          <h3>Search for songs</h3>
          <SearchBar
            value={songsSearch}
            setValue={setSongsSearch}
            setAllFoundSongs={setAllSongs}
            defaultSearchMode={"songs"}
            inputText={"Search for songs"}
          />
          <div className="chosenAuthorsList">
            {chosenSongs.map((songId) => {
              return (
                <div className="chosenAuthorItem">
                  <span>{songId}</span>
                  <FiXCircle onClick={() => removeSongFromList(songId)} />
                </div>
              );
            })}
          </div>
          <div className="authorsResult">
            {allSongs.map((data, index) => {
              return (
                <SongItem
                  song={data}
                  localIndex={index}
                  listOfChosenSongs={chosenSongs}
                  setListOfSongs={setChosenSongs}
                />
              );
            })}
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
          text={"Download playlist cover"}
          place={"songsImages/"}
          setItemSrc={setPlaylistCover}
          setImageLocalPath={setImageLocalPath}
        />
        <SubmitButton
          text={"Add playlists"}
          action={addPlaylistToFirebase}
          isLoading={loadingPlaylist}
          completed={completed}
          setCompleted={setCompleted}
          bottomMessage={"Playlist was uploaded to database"}
        />
      </div>
    </div>
  );
};
