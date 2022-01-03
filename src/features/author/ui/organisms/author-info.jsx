import React, { useEffect, useState } from "react";
import { FiHeadphones, FiUserPlus } from "react-icons/fi";
import { ImCheckmark } from "react-icons/im";
import { PersonTinyVerticalItem } from "../atoms/person-tiny-vertical-item";
import { useModal } from "../../../../contexts/modal";
import { useSong } from "../../../../contexts/song";
import displayDate from "../../../../shared/lib/display-date";
import { SeeMoreRoundButton } from "../../../../shared/ui/atoms/see-more-round-button";
import { LoadingCircle } from "../../../loading/ui/atoms/loading-circle";
import { FriendsToShareWith } from "../../../share/ui/organisms/friends-to-share-with";
import { TinyPersonsList } from "../templates/tiny-persons-list";

export const AuthorInfo = ({ author }) => {
  const { setContent } = useModal();
  const { yourFriends } = useSong();
  const [friendsThatHaveThisSong, setFriendsThatHaveThisAuthor] = useState([]);
  const [loading, setLoading] = useState(true);
  async function findFriendsThatHaveThisAuthor() {
    setLoading(true);
    setFriendsThatHaveThisAuthor([]);
    yourFriends.forEach((friend) => {
      if (author.isAuthor) {
        if (friend.addedAuthors.includes(author.uid))
          setFriendsThatHaveThisAuthor((prev) => [...prev, friend]);
      } else {
        if (friend.friends.find((person) => person.uid === author.uid))
          setFriendsThatHaveThisAuthor((prev) => [...prev, friend]);
      }
    });
    setLoading(false);
  }

  useEffect(() => {
    findFriendsThatHaveThisAuthor();
  }, [author.uid]);

  return (
    <div className="SongInfo">
      <div
        className="songImage"
        style={{ backgroundImage: `url(${author.photoURL})` }}
      ></div>
      <div className="songInfoContent">
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          <h3 style={{ color: author.imageColors[1] }}>
            {author.displayName}
            {author.isVerified ? (
              <ImCheckmark
                style={{
                  color: author.imageColors[0],
                  width: "15px",
                  height: "15px",
                  marginLeft: "5px",
                }}
              />
            ) : null}
          </h3>
          <span style={{ opacity: ".5", fontWeight: 500, fontSize: ".7em" }}>
            {author.isAuthor ? "Author" : "User"}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            opacity: "0.6",
            fontSize: ".9em",
            position: "relative",
          }}
          className="listensAndDate"
        >
          <p
            className="infoListens"
            style={{ marginRight: "20px", position: "relative" }}
          >
            {author.numberOfListenersPerMonth}
            <FiHeadphones />
          </p>
          <p
            className="infoListens"
            style={{ marginRight: "20px", position: "relative" }}
          >
            {author.subscribers} <FiUserPlus />
          </p>
          <span>{displayDate(author.regDate)}</span>
        </div>
        <h4 style={{ margin: "10px 0" }}>
          {friendsThatHaveThisSong.length > 0
            ? "Friends subscribed"
            : "None of your friends subscribed"}
        </h4>
        {!loading ? (
          <div style={{ display: "flex" }}>
            {friendsThatHaveThisSong.length > 0 ? (
              <>
                {friendsThatHaveThisSong.map((person, index) => {
                  if (index < 2)
                    return (
                      <PersonTinyVerticalItem
                        person={person}
                        key={person.uid}
                      />
                    );
                })}
                {friendsThatHaveThisSong.length > 2 ? (
                  <SeeMoreRoundButton
                    onClick={() =>
                      setContent(
                        <TinyPersonsList
                          listOfPeople={friendsThatHaveThisSong}
                          title={`Friends subscribed to ${author.displayName}`}
                        />
                      )
                    }
                  />
                ) : null}
              </>
            ) : (
              <button
                className="shareBtn"
                style={{ minHeight: "35px", background: author.imageColors[0] }}
                onClick={() => {
                  setContent(
                    <FriendsToShareWith item={author} whatToShare={"author"} />
                  );
                }}
              >
                Share
              </button>
            )}
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
