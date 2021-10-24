import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import { useSong } from "../../../../contexts/SongContext";
import getUID from "../../../../functions/other/getUID";
import { createChat } from "../../../../shared/lib/create-сhat";
import { findChatURL } from "../../../../shared/lib/find-chat-url";

const useCreateChat = () => {
  const { currentUser } = useAuth();
  const { toggleModal } = useModal();
  const { yourFriends } = useSong();
  const [searchValue, setSearchValue] = useState("");
  const [foundFriends, setFoundFriends] = useState(yourFriends);
  const [chosenFriends, setChosenFriends] = useState([]);
  const [chatCover, setChatCover] = useState("");
  const [chatName, setChatName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const chatId = getUID();
  const history = useHistory();
  const [shouldCreate, setShouldCreate] = useState(false);
  const [friendChatId, setFriendChatId] = useState(0);
  const [allowedToCreate, setAllowedToCreate] = useState(false);
  useEffect(() => {
    if (chosenFriends.length >= 1) {
      findChatURL(chosenFriends, currentUser, setShouldCreate, setFriendChatId);
    }
  }, [chosenFriends]);

  useEffect(() => {
    if (chatName.length === 0 || chosenFriends.length === 0) {
      setAllowedToCreate(false);
    } else setAllowedToCreate(true);
    setErrorMessage("");
  }, [chosenFriends.length, chatName]);

  const handleCreateChat = () => {
    if (shouldCreate) {
      if (allowedToCreate) {
        createChat(
          [currentUser.uid, ...chosenFriends],
          chatId,
          chatName,
          chatCover,
          [currentUser.uid]
        ).then(() => {
          history.push(`/chat/${chatId}`);
          toggleModal();
        });
      } else setErrorMessage("Chat has to have a name");
    } else {
      history.push(`/chat/${friendChatId}`);
      toggleModal();
    }
  };

  return {
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
  };
};

export default useCreateChat;
