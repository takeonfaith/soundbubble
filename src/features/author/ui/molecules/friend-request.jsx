import React from "react";
import { FriendRequestItem } from "../atoms/friend-request-item";
import useFriendRequest from "../../lib/hooks/use-friend-request";

export const FriendRequest = () => {
  const [friendRequests, addFriend, rejectFriend] = useFriendRequest();

  return (
    <>
      {friendRequests.map((person, index) => {
        return (
          <FriendRequestItem
            person={person}
            key={index}
            addFriend={addFriend}
            rejectFriend={rejectFriend}
          />
        );
      })}
    </>
  );
};
