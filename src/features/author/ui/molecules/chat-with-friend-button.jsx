import React, { useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/auth";
import { createChat } from "../../../../shared/lib/create-сhat";
import { findChatURL } from "../../../../shared/lib/find-chat-url";

export const ChatWithFriendButton = ({ data, color }) => {
  const { currentUser } = useAuth();
  const [shouldCreate, setShouldCreate] = useState(false);
  const [friendChatId, setFriendChatId] = useState(0);

  useEffect(() => {
    findChatURL([data.uid], currentUser, setShouldCreate, setFriendChatId);
  }, [data.uid]);

  return (
    <Link
      to={`/chat/${friendChatId}`}
      style={{ display: "block", width: "fit-content", textDecoration: "none" }}
    >
      <button
        onClick={() => {
          if (shouldCreate)
            createChat([currentUser.uid, data.uid], friendChatId);
        }}
        style={{ background: color }}
        className="ChatWithFriendButton"
      >
        <FiMessageCircle /> Messages
      </button>
    </Link>
  );
};
