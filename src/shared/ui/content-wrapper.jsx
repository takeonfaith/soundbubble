import React from "react";
import { ContentRouter } from "../../app/routers/content-router";
import { useScreen } from "../../contexts/screen";
import { useSong } from "../../contexts/song";
import { useUpdateListenCount } from "../../entities/song/lib/hooks/use-update-listen-count";
import { MessageWindow } from "../../features/bottom-message/ui/message-window";
import ChatNotificationWindow from "../../features/chats/ui/organisms/chat-notification-window";
import { ConfirmWindow } from "../../features/confirm/ui/confirm-window";
import FullScreenPlayer from "../../features/full-screen-player/ui/full-screen-player";
import "../../features/full-screen-player/ui/style.css";
import { LeftsideBar } from "../../features/leftside-bar/ui/organisms/leftside-bar";
import { FullBottomSide } from "../../features/mobile/ui/organisms/full-bottom-side";
import { ModalWindow } from "../../features/modal/ui/modal-window";
import useChatNotifications from "../lib/hooks/use-chat-notifications";
import { useMediaMetadata } from "../lib/hooks/use-media-metadata";
import useUpdateOnlineStatus from "../lib/hooks/use-update-online-status";

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
  const [notifications, setNotifications] = useChatNotifications();
  // useFriendInviteNotifications();

  useMediaMetadata();
  useUpdateOnlineStatus();
  const updateListenCount = useUpdateListenCount();

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
