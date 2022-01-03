import React from "react";
import { BiAlbum } from "react-icons/bi";
import { CgLock } from "react-icons/cg";
import { FiHeadphones, FiUserPlus } from "react-icons/fi";
import { ImCheckmark } from "react-icons/im";
import { useAuth } from "../../contexts/auth";
import { useSong } from "../../contexts/song";
import { useAlbumAuthors } from "../../entities/playlist/lib/hooks/use-album-authors";
import bigNumberFormat from "../../shared/lib/big-number-format";
import displayDate from "../../shared/lib/display-date";
import { Hint } from "../../shared/ui/atoms/hint";
import { LastSeen } from "../../shared/ui/atoms/last-seen";
import { SmallImages } from "../album/ui/atoms/small-images";
import { ChatWithFriendButton } from "../author/ui/molecules/chat-with-friend-button";
import { LastSongListened } from "../author/ui/molecules/last-song-listened";
import TopButtons from "./ui/molecules/top-buttons";

export const Header = ({ data, headerColors }) => {
  const { displayAuthors } = useSong();
  const [albumAuthors, authorsImages] = useAlbumAuthors(data);
  const { currentUser } = useAuth();
  const isFriend = currentUser.friends.find(
    (friend) => friend.uid === data.uid && friend.status === "added"
  );

  function displayCreationDateIfExists() {
    return data.creationDate !== undefined ? (
      <div className="headerListenersAndSubsItem">
        <Hint text={"creation date"} style={{ fontSize: "0.8em" }} />
        <span>{displayDate(data.creationDate)}</span>
      </div>
    ) : null;
  }

  function isAlbumOrIsAuthor() {
    return data.authors !== undefined ? (
      data.isAlbum ? (
        <h5>Album</h5>
      ) : (
        <h5>Playlist</h5>
      )
    ) : data.isAuthor ? (
      <h5>Author</h5>
    ) : (
      <h5>
        User{" "}
        {data.authors === undefined && isFriend ? (
          <LastSeen userUID={data.uid} />
        ) : null}
      </h5>
    );
  }

  function showCreatorsIfExist() {
    return data.authors !== undefined ? (
      <div className="headerAuthorsImagesAndNames">
        <SmallImages imagesList={authorsImages} borderColor={headerColors[2]} />
        <div className="headerAuthors">
          {displayAuthors(albumAuthors, ", ")}
        </div>
      </div>
    ) : null;
  }

  function findIfIsVerified() {
    return data.isVerified ? (
      <ImCheckmark style={{ color: headerColors[0] }} />
    ) : null;
  }

  function findIfIsPrivate() {
    return data.isPrivate ? <CgLock /> : null;
  }

  return (
    <div
      className="Header"
      style={
        headerColors.length
          ? {
              background: `linear-gradient(45deg, ${headerColors[2]}, ${headerColors[0]})`,
            }
          : { background: "var(--yellowAndPinkGrad)" }
      }
    >
      <TopButtons data={data} headerColors={headerColors} />
      <div
        className="headerAuthorsImage"
        style={
          data.authors === undefined
            ? {
                animation: "floatingBorderRadius 10s infinite ease-in-out",
                backgroundImage: `url(${data.photoURL})`,
                position: "relative",
              }
            : {
                backgroundImage: `url(${data.image})`,
                position: "relative",
                backgroundColor: "var(--red)",
              }
        }
      >
        {data.authors !== undefined && !data.image ? (
          <BiAlbum
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "60px",
              height: "60px",
            }}
          />
        ) : null}
      </div>
      <div className="headerAuthorInfo">
        <div className="headerAuthorsName">
          {isAlbumOrIsAuthor()}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "2px 0 10px 0",
            }}
          >
            <>
              <h1>{data.displayName || data.name}</h1>
            </>
            {findIfIsVerified()}
            {findIfIsPrivate()}
            {!!data.displayName && isFriend && (
              <LastSongListened data={data} loading={false} />
            )}
          </div>
        </div>
        {showCreatorsIfExist()}

        <div className="headerListenersAndSubs">
          <div className="headerListenersAndSubsItem">
            <Hint
              text={
                (data.listens ?? data.numberOfListenersPerMonth) + " listens"
              }
              style={{ fontSize: "0.8em" }}
            />
            <span>
              {bigNumberFormat(data.listens ?? data.numberOfListenersPerMonth)}
            </span>
            <FiHeadphones />
          </div>
          <div className="headerListenersAndSubsItem">
            <Hint
              text={data.subscribers + " subscribers"}
              style={{ fontSize: "0.8em" }}
            />
            <span>{bigNumberFormat(data.subscribers)}</span>
            <FiUserPlus />
          </div>
          {displayCreationDateIfExists()}
        </div>
        {isFriend ? (
          <ChatWithFriendButton data={data} color={headerColors[3]} />
        ) : null}
      </div>
    </div>
  );
};
