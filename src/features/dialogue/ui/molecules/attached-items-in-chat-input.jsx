import React from "react";
import { FiX } from "react-icons/fi";
export const AttachedItemsInChatInput = ({
  list,
  attachedItems,
  setAttachedItems,
  icon,
}) => {
  const findName = (itemId) =>
    list.find((item) => item.id === itemId || item.uid === itemId);

  function removeItemFromAttached(attachedItems, setItems, itemId) {
    setItems(attachedItems.filter((id) => id !== itemId));
  }
  return (
    <div className="AttachedItemsInChatInput">
      {attachedItems.map((itemId, index) => {
        return (
          <div className="attachedSongItem" key={itemId}>
            {icon}
            <span>{findName(itemId).name || findName(itemId).displayName}</span>
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
