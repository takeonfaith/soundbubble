import React from "react";
import useUserOnline from "../../shared/lib/hooks/use-user-online";

export const IsUserOnlineCircle = ({ userUID, setIsOnline = null }) => {
  const isOnline = useUserOnline(userUID);

  return isOnline ? <div className="onlineCircle"></div> : null;
};
