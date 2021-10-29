import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "../../../../contexts/AuthContext";
import { GoBackBtn } from "../../../../shared/ui/atoms/go-back-button";
import ButtonItem from "../atoms/button-item";

const TopButtons = ({ data, headerColors }) => {
  const { currentUser } = useAuth();
  return (
    <div className="headerBtns" style={{ background: headerColors[2] }}>
      <GoBackBtn />
      <div style={{ display: "flex" }}>
        <div className="headerBackBtn">{whatButtonToRender()}</div>
        <div className="headerMoreBtn" ref={moreWindowRef}>
          <button
            onClick={
              !isMobile
                ? () => setOpenMoreWindow(!openMoreWindow)
                : () => {
                    toggleModal();
                    setContent(<AuthorMoreWindow data={data} />);
                  }
            }
          >
            <Hint text={"more"} direction={"bottom"} />
            <FiMoreVertical />
          </button>
          {openMoreWindow ? (
            <div
              className="songItemMenuWindow"
              style={{ top: "110%", bottom: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              {(data.authors &&
                data.authors.find(
                  (person) => person.uid === currentUser.uid
                )) ||
              (data.authors && currentUser.isAdmin) ? (
                <div
                  className="songItemMenuWindowItem"
                  onClick={() => {
                    toggleModal();
                    setContent(<CustomizeAlbum playlist={data} />);
                  }}
                >
                  <FiEdit2 />
                  Edit
                </div>
              ) : data.uid === currentUser.uid && !data.isAuthor ? (
                <div
                  className="songItemMenuWindowItem"
                  onClick={() => {
                    toggleModal();
                    setContent(<CustomizeAuthor author={data} />);
                  }}
                >
                  <FiEdit2 />
                  Edit
                </div>
              ) : null}
              <div
                className="songItemMenuWindowItem"
                onClick={() => {
                  toggleModal();
                  setContent(
                    <FriendsListToShareWith
                      item={data}
                      whatToShare={
                        data.authors !== undefined ? "playlist" : "author"
                      }
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
                  toggleModal();
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
          ) : null}
        </div>
      </div>
      {currentUser.uid === data.uid ? (
        
      ) : null}
    </div>
  );
};

export default TopButtons;
