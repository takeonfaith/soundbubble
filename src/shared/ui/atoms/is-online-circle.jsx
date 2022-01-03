import React from "react";
import useUserOnline from "../../lib/hooks/use-user-online";

export const IsOnlineCircle = ({ userUID }) => {
  const isOnline = useUserOnline(userUID);

  return isOnline ? <div className="onlineCircle" /> : null;
};
