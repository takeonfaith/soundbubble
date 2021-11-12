import React, { useState } from "react";

import { useSong } from "../../../../contexts/song";
import filterArrayOfObjectsWithArray from "../../../../shared/lib/filter-array-of-objects-with-array";
import SubmitButton from "../../../../shared/ui/atoms/submit-button";
import SearchBar from "../../../../shared/ui/organisms/search-bar";
import { TinyPersonsList } from "../../../author/ui/templates/tiny-persons-list";
import addPeopleToChat from "../../lib/add-people-to-chat";

const AddPeopleToChat = ({ chat }) => {
  const { yourFriends } = useSong();
  const [searchValue, setSearchValue] = useState("");
  const [foundFriends, setFoundFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const filteredFriends = filterArrayOfObjectsWithArray(
    yourFriends,
    chat.participants
  );
  const [chosenFriends, setChosenFriends] = useState([]);
  return (
    <div>
      <SearchBar
        value={searchValue}
        setValue={setSearchValue}
        setResultAuthorList={setFoundFriends}
        defaultSearchMode="authors"
        defaultAuthorsListValue={filteredFriends}
      />
      <TinyPersonsList
        listOfPeople={foundFriends}
        chosenArray={chosenFriends}
        setChosenArray={setChosenFriends}
        lastSeen
      />
      {!!chosenFriends.length && (
        <SubmitButton
          text={`Add ${chosenFriends.length} friends`}
          action={() =>
            addPeopleToChat(
              chat.id,
              filterArrayOfObjectsWithArray(
                yourFriends,
                chosenFriends,
                "uid",
                false
              ),
              setLoading,
              setCompleted
            )
          }
          isLoading={loading}
          completed={completed}
          setCompleted={setCompleted}
          bottomMessage={`${chosenFriends.length} friends have been added to ${chat.chatName}`}
        />
      )}
    </div>
  );
};

export default AddPeopleToChat;
