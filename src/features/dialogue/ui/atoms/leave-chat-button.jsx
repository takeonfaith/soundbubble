import React from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import { Hint } from "../../../../components/Basic/Hint";
import { useAuth } from "../../../../contexts/AuthContext";
import { useModal } from "../../../../contexts/ModalContext";
import Button from "../../../../shared/ui/atoms/button";
import leaveChat from "../../lib/leave-chat";
import { ChatInfo } from "../organisms/chat-info";

const LeaveChatButton = ({ chat, user }) => {
  const { currentUser } = useAuth();
  const { openConfirm, closeConfirm, setContent } = useModal();
  const isCurrentUserLeaving = currentUser.uid === user.uid;
  return (
    <>
      <Hint text={isCurrentUserLeaving ? "quit chat" : "kick"} />
      <Button
        onClick={() =>
          openConfirm(
            `Are you sure you want to ${
              isCurrentUserLeaving ? "leave" : `kick ${user.displayName} `
            } from this chat?`,
            "Yes",
            "No",
            () => {
              leaveChat(chat.id, user);
              closeConfirm();
              setContent(<ChatInfo data={chat} />);
            }
          )
        }
        icon={isCurrentUserLeaving ? <FiLogOut /> : <FiX />}
      />
    </>
  );
};

export default LeaveChatButton;
