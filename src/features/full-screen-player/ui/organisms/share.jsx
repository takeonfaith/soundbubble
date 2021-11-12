import React from "react";
import { FaFacebookF, FaTelegramPlane, FaVk } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { AiFillInstagram } from "react-icons/ai";
import { ImWhatsapp } from "react-icons/im";
import { useSong } from "../../../../contexts/song";
import { FriendsToShareWith } from "../../../share/ui/organisms/friends-to-share-with";
export const Share = () => {
  const { currentSongData } = useSong();
  const socialMedia = [
    <ImWhatsapp />,
    <FaFacebookF />,
    <FaTelegramPlane />,
    <FaVk />,
    <AiFillInstagram />,
  ];
  return (
    <div className="Share">
      <button className="shareCopyLink">
        <FiCopy />
        Copy link
      </button>
      <div className="shareOnSocial">
        {socialMedia.map((social, index) => {
          return (
            <div className="shareSocialIcon" key={index}>
              {social}
            </div>
          );
        })}
      </div>
      <div className="sharePeopleShort">
        <FriendsToShareWith item={currentSongData} whatToShare={"song"} />
      </div>
    </div>
  );
};
