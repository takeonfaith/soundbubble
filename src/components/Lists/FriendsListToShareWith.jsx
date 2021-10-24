import React, { useEffect, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { useSong } from "../../contexts/SongContext";
import shareWithFriends from "../../functions/other/shareWithManyFriends";
import { PersonTiny } from "../Basic/PersonTiny";
import SearchBar from "../../shared/ui/organisms/search-bar";
import Input from "../../shared/ui/atoms/input";
import SubmitButton from "../../shared/ui/atoms/submit-button";
import { TinyPersonsList } from "./TinyPersonsList";
export const FriendsListToShareWith = ({ item, whatToShare = "song" }) => {
  const { yourFriends } = useSong();
  const [chosenFriends, setChosenFriends] = useState([]);
  const { currentUser } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toggleModal, openBottomMessage } = useModal();
  const [searchValue, setSearchValue] = useState("");
  const [foundPeople, setFoundPeople] = useState([]);

  return yourFriends.length ? (
    <div className="FriendsListToShareWith">
      <div
        style={{
          maxHeight: "300px",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SearchBar
          value={searchValue}
          setValue={setSearchValue}
          setResultAuthorList={setFoundPeople}
          defaultAuthorsListValue={yourFriends}
          defaultSearchMode={"authors"}
          inputText={"Search for friends"}
        />
        <div style={{ overflowY: "auto", maxHeight: "100%" }}>
          <TinyPersonsList
            listOfPeople={foundPeople}
            chosenArray={chosenFriends}
            setChosenArray={setChosenFriends}
          />
        </div>
      </div>
      <>
        <Input
          value={messageText}
          setValue={setMessageText}
          placeholder="Your message"
        />
        <SubmitButton
          text={`Share with ${chosenFriends.length} ${
            chosenFriends.length > 1 || chosenFriends.length === 0
              ? "friends"
              : "friend"
          }`}
          action={() => {
            shareWithFriends({
              shareList: chosenFriends,
              currentUser,
              itemId: whatToShare === "author" ? item.uid : item.id,
              whatToShare,
              messageText,
              setLoading,
              setCompleted,
            });
            toggleModal();
          }}
          completed={completed}
          setCompleted={setCompleted}
          bottomMessage={"Message was sent"}
          isActive={!!chosenFriends.length}
        />
      </>
    </div>
  ) : (
    <h3 style={{ margin: 0 }}>No friends added</h3>
  );
};
