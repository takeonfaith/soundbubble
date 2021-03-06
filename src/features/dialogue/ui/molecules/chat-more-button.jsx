import React, { useRef, useState } from "react";
import { FiFolder, FiImage, FiInfo, FiMoreHorizontal } from "react-icons/fi";
import { useModal } from "../../../../contexts/modal";
import useOutsideClick from "../../../../shared/lib/hooks/use-outside-click";
import { ChatInfo } from "../organisms/chat-info";
import { AttachmentList } from "./attachment-list";
import { Wallpapers } from "./wallpapers";

export const ChatMoreBtn = ({ chatId, currentWallpaper, data }) => {
  const [openMoreWindow, setOpenMoreWindow] = useState();
  const { toggleModal, setContent } = useModal();
  const chatMoreBtnRef = useRef(null);
  useOutsideClick(chatMoreBtnRef, setOpenMoreWindow);
  return (
    <div className="ChatMoreBtn" ref={chatMoreBtnRef}>
      <button onClick={() => setOpenMoreWindow(!openMoreWindow)}>
        <FiMoreHorizontal />
      </button>
      <div
        className="chatHeaderMenuWindow"
        style={!openMoreWindow ? { display: "none" } : {}}
      >
        {data.participants.length > 2 ? (
          <div
            className="chatHeaderMenuWindowItem"
            onClick={() => {
              toggleModal();
              setContent(<ChatInfo data={data} />);
            }}
          >
            <FiInfo />
            <span>Info</span>
          </div>
        ) : null}
        {/* <div className="chatHeaderMenuWindowItem">
					<FiSearch/>
					<span>Search messages</span>
				</div> */}
        <div
          className="chatHeaderMenuWindowItem"
          onClick={() => {
            toggleModal();
            setContent(<AttachmentList chatId={chatId} />);
          }}
        >
          <FiFolder />
          <span>Attachments</span>
        </div>
        <div
          className="chatHeaderMenuWindowItem"
          onClick={() => {
            toggleModal();
            setContent(
              <Wallpapers chatId={chatId} currentWallpaper={currentWallpaper} />
            );
          }}
        >
          <FiImage />
          <span>Change wallpaper</span>
        </div>
        {/* <div className="chatHeaderMenuWindowItem">
					<FiTrash/>
					<span>Delete chat</span>
				</div> */}
      </div>
    </div>
  );
};
