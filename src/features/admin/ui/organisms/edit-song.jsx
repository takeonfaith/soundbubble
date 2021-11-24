import React from "react";
import { FiXCircle } from "react-icons/fi";
import { useAuth } from "../../../../contexts/auth";
import { PersonTiny } from "../../../../entities/user/ui/organisms/person-tiny";
import Input from "../../../../shared/ui/atoms/input";
import SubmitButton from "../../../../shared/ui/atoms/submit-button";
import SearchBar from "../../../../shared/ui/organisms/search-bar";
import useEditSong from "../../lib/hooks/use-edit-song";
export const EditSong = ({ song }) => {
  const { currentUser } = useAuth();
  const {
    songCover,
    songName,
    setSongName,
    imageColors,
    manuallyChangeColor,
    searchValue,
    setSearchValue,
    foundAuthors,
    setFoundAuthors,
    songAuthors,
    removeAuthorFromList,
    addAuthor,
    lyrics,
    setLyrics,
    updateSong,
    loading,
    completed,
    setCompleted,
  } = useEditSong(song);

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
              height: "200px",
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
      <Input
        title="Song name"
        value={songName}
        setValue={setSongName}
        placeholder="Enter song name"
        required
      />
      <div>
        <h3>Authors</h3>
        <SearchBar
          value={searchValue}
          setValue={setSearchValue}
          setResultAuthorList={setFoundAuthors}
          defaultSearchMode={"users"}
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
