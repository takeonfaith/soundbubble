import React, { useEffect, useState } from "react";
import { CgMusicNote } from "react-icons/cg";
import { PersonTinyVerticalItem } from "../../../author/ui/atoms/person-tiny-vertical-item";
import { useModal } from "../../../../contexts/modal";
import { useSong } from "../../../../contexts/song";
import displayDate from "../../../../shared/lib/display-date";
import { SeeMoreRoundButton } from "../../../../shared/ui/atoms/see-more-round-button";
import { TinyPersonsList } from "../../../author/ui/templates/tiny-persons-list";
import { LoadingCircle } from "../../../loading/ui/atoms/loading-circle";
import { FriendsToShareWith } from "../../../share/ui/organisms/friends-to-share-with";

export const SongInfo = ({ song }) => {
  const { currentSongData } = useSong();
  const { setContent } = useModal();
  const [songData, setSongData] = useState(song || currentSongData);
  const { displayAuthors, yourFriends } = useSong();
  const [friendsThatHaveThisSong, setFriendsThatHaveThisSong] = useState([]);
  const [loading, setLoading] = useState(true);
  async function findFriendsThatHaveThisSong() {
    setLoading(true);
    setFriendsThatHaveThisSong([]);
    yourFriends.forEach((friend) => {
      if (friend.addedSongs.includes(songData.id))
        setFriendsThatHaveThisSong((prev) => [...prev, friend]);
    });
    setLoading(false);
  }

  useEffect(() => {
    if (song !== undefined) setSongData(song);
  }, [song && song.id]);

  useEffect(() => {
    findFriendsThatHaveThisSong();
  }, [songData.id]);

  return (
    <div className="SongInfo">
      <div
        className="songImage"
        style={{ backgroundImage: `url(${songData.cover})` }}
      ></div>
      <div className="songInfoContent">
        <h3 style={{ color: songData.imageColors[0] }}>{songData.name}</h3>
        <span>{displayAuthors(songData.authors, ", ")}</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            opacity: "0.6",
            fontSize: ".9em",
            position: "relative",
            marginTop: "5px",
          }}
          className="listensAndDate"
        >
          <p
            className="infoListens"
            style={{
              marginRight: "15px",
              marginBottom: "0",
              position: "relative",
            }}
          >
            {songData.listens} <CgMusicNote />
          </p>
          <span>{displayDate(songData.releaseDate)}</span>
        </div>
        <h4 style={{ margin: "10px 0" }}>
          {friendsThatHaveThisSong.length > 0
            ? "Friends that listen that song"
            : "None of your friends listens this"}
        </h4>
        {!loading ? (
          <div style={{ display: "flex" }}>
            {friendsThatHaveThisSong.length > 0 ? (
              friendsThatHaveThisSong.map((person, index) => {
                if (index < 2)
                  return (
                    <PersonTinyVerticalItem person={person} key={person.uid} />
                  );
              })
            ) : (
              <button
                className="shareBtn"
                style={{
                  minHeight: "35px",
                  background: songData.imageColors[0],
                }}
                onClick={() => {
                  setContent(
                    <FriendsToShareWith item={songData} whatToShare={"song"} />
                  );
                }}
              >
                Share
              </button>
            )}
            {friendsThatHaveThisSong.length > 2 ? (
              <SeeMoreRoundButton
                onClick={() =>
                  setContent(
                    <TinyPersonsList
                      listOfPeople={friendsThatHaveThisSong}
                      title={`Friends listen ${song.name}`}
                    />
                  )
                }
              />
            ) : null}
          </div>
        ) : (
          <div style={{ position: "relative", height: "50px" }}>
            <LoadingCircle top={"50%"} />
          </div>
        )}
      </div>
    </div>
  );
};
