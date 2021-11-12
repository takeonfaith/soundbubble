import React from "react";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { useModal } from "../../../contexts/modal";

export const MessageWindow = () => {
  const { bottomMessage } = useModal();

  const findIcon = () => {
    switch (bottomMessage.type) {
      case "success":
        return <FaRegCheckCircle />;
      case "failure":
        return <FaRegTimesCircle />;
      default:
        return <FaRegCheckCircle />;
    }
  };

  const findColor = () => {
    switch (bottomMessage.type) {
      case "success":
        return { light: "#69e985", dark: "#12321ce6" };
      case "failure":
        return { light: "#f4546a", dark: "#581921d8" };
      default:
        return { light: "#69e985", dark: "#12321ce6" };
    }
  };

  return (
    <div
      className={`bottom-message ${bottomMessage.isOpenned ? "openned" : ""}`}
      style={{ background: findColor().dark, color: findColor().light }}
    >
      {findIcon()}
      <span>{bottomMessage.message}</span>
    </div>
  );
};
