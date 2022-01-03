import React from "react";
import { useModal } from "../../../../contexts/modal";
import { FiFlag, FiInfo, FiShare } from "react-icons/fi";
import { FriendsToShareWith } from "../../../share/ui/organisms/friends-to-share-with";
import { AlbumInfo } from "../../../album/ui/organisms/album-info";
import { AuthorInfo } from "../organisms/author-info";
export const AuthorMoreWindow = ({ data }) => {
  const { setContent } = useModal();
  return (
    <div
      className="AuthorMoreWindow"
      style={{ top: "110%", bottom: "auto" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="songItemMenuWindowItem"
        onClick={() => {
          setContent(
            <FriendsToShareWith
              item={data}
              whatToShare={data.authors !== undefined ? "playlist" : "author"}
            />
          );
        }}
      >
        <FiShare />
        Share
      </div>
      <div
        className="songItemMenuWindowItem"
        onClick={() => {
          setContent(
            data.authors !== undefined ? (
              <AlbumInfo album={data} />
            ) : (
              <AuthorInfo author={data} />
            )
          );
        }}
      >
        <FiInfo />
        Info
      </div>
    </div>
  );
};
