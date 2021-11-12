import React from "react";
import { TinyPersonsList } from "../../../author/ui/templates/tiny-persons-list";
import DownloadButton from "../../../../shared/ui/atoms/download-button";
import Input from "../../../../shared/ui/atoms/input";
import SubmitButton from "../../../../shared/ui/atoms/submit-button";
import SearchBar from "../../../../shared/ui/organisms/search-bar";
import useCreateChat from "../../lib/hooks/use-create-chat";

export const CreateChat = () => {
  const {
    searchValue,
    setSearchValue,
    foundFriends,
    setFoundFriends,
    chosenFriends,
    setChosenFriends,
    chatName,
    setChatName,
    setChatCover,
    handleCreateChat,
    shouldCreate,
    allowedToCreate,
  } = useCreateChat();

  return (
    <div className="CreateChat">
      <SearchBar
        value={searchValue}
        setValue={setSearchValue}
        setResultAuthorList={setFoundFriends}
        focus
        inputText={"Search for friends"}
        defaultSearchMode={"authors"}
      />
      <TinyPersonsList
        listOfPeople={foundFriends}
        chosenArray={chosenFriends}
        setChosenArray={setChosenFriends}
        lastSeen
      />
      {chosenFriends.length > 1 && shouldCreate && (
        <>
          <Input
            title="Chat name"
            value={chatName}
            setValue={setChatName}
            placeholder="Enter chat name"
          />
          <DownloadButton
            title={"Chat image"}
            text={"Download chat image"}
            place={"chatCovers/"}
            setItemSrc={setChatCover}
            setImageLocalPath={() => null}
          />
        </>
      )}
      <SubmitButton
        text={shouldCreate ? "Create Chat" : "Go to chat"}
        action={handleCreateChat}
        isActive={
          chosenFriends.length > 0 &&
          ((shouldCreate && allowedToCreate) || !shouldCreate)
        }
      />
    </div>
  );
};
