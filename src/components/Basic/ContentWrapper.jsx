import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useScreen } from "../../contexts/ScreenContext";
import { useSong } from "../../contexts/SongContext";
import { LeftsideBar } from "../../features/leftside-bar/ui/organisms/leftside-bar";
import { firestore } from "../../firebase";
import { useMediaMetadata } from "../../hooks/useMediaMetadata";
import { useUpdateListenCount } from "../../hooks/useUpdateListenCount";
import { ContentRouter } from "../../routers/ContentRouter";
import useChatNotifications from "../../shared/lib/hooks/use-chat-notifications";
import "../../styles/FullScreenPlayer.css";
import { FullBottomSide } from "../Mobile/FullBottomSide";
import ChatNotificationWindow from "../Windows/chat-notification-window";
import { ConfirmWindow } from "../Windows/ConfirmWindow";
import { MessageWindow } from "../Windows/MessageWindow";
import { ModalWindow } from "../Windows/ModalWindow";
import FullScreenPlayer from "./FullScreenPlayer";

export const ContentWrapper = () => {
  const {
    songRef,
    loadSongData,
    playing,
    songSrc,
    openFullScreenPlayer,
    repeatMode,
    setPlay,
    prevSong,
    currentSongQueue,
    nextSong,
  } = useSong();
  const { isMobile, screenHeight } = useScreen();
  const { currentUser } = useAuth();
  const fiveMinutes = 300000; // 10min
  const [intervalExciter, setIntervalExciter] = useState(true);
  const [notifications, setNotifications] = useChatNotifications();

  useMediaMetadata();
  const updateListenCount = useUpdateListenCount();
  useEffect(() => {
    const interval = setInterval(() => {
      firestore
        .collection("users")
        .doc(currentUser.uid)
        .update({ online: new Date().getTime() });
      setIntervalExciter(!intervalExciter);
    }, fiveMinutes);
    return () => clearInterval(interval);
  }, [intervalExciter]);

  useEffect(() => {
    firestore
      .collection("users")
      .doc(currentUser.uid)
      .update({ online: new Date().getTime() });
  }, []);

  function audioEnded() {
    if (repeatMode === 0) {
      songRef.current.pause();
      setPlay(false);
      return prevSong();
    } else if (repeatMode === 1) {
      if (currentSongQueue.length === 1) {
        prevSong();
        updateListenCount();
        return songRef.current.play();
      }
      return nextSong();
    }
    prevSong();
    updateListenCount();
    songRef.current.play();
  }

  return (
    <>
      <audio
        src={songSrc}
        ref={songRef}
        onLoadedData={loadSongData}
        onTimeUpdate={playing}
        onEnded={audioEnded}
      ></audio>
      <div
        className={"Wrapper " + (openFullScreenPlayer ? "turnedOff" : "")}
        style={isMobile ? { height: screenHeight } : { height: "100vh" }}
      >
        {!isMobile ? (
          <LeftsideBar />
        ) : window.location.hash.substr(2, 4) === "chat" &&
          window.location.hash.length > 6 ? null : (
          <FullBottomSide />
        )}
        <div className="Content">
          <ContentRouter />
        </div>
        <MessageWindow />
        <ModalWindow />
        <ConfirmWindow />
        {notifications.map((notif, index) => {
          return (
            <ChatNotificationWindow
              {...notif}
              index={index}
              notifsLen={notifications.length}
              setNotifications={setNotifications}
            />
          );
        })}
      </div>
      <FullScreenPlayer />
    </>
  );
};
