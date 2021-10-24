import React from "react";
import { FiX } from "react-icons/fi";
export const AttachedItemsInChatInput = ({
  attachedItems,
  setAttachedItems,
  icon,
}) => {
  function removeItemFromAttached(attachedItems, setItems, itemId) {
    setItems(attachedItems.filter((id) => id !== itemId));
  }
  return (
    <div className="AttachedItemsInChatInput">
      {attachedItems.map((itemId, index) => {
        return (
          <div className="attachedSongItem" key={itemId}>
            {icon}
            <span>{itemId}</span>
            <button
              className="removeMessageFromResponse"
              onClick={() =>
                removeItemFromAttached(attachedItems, setAttachedItems, itemId)
              }
            >
              <FiX />
            </button>
          </div>
        );
      })}
    </div>
  );
};
