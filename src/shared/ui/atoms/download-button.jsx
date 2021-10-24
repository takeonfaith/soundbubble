import React, { useEffect, useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { ImCheckmark } from "react-icons/im";
import styled from "styled-components";
import { LoadingCircle } from "../../../components/Loading/LoadingCircle";
import { useModal } from "../../../contexts/ModalContext";
import { storage } from "../../../firebase";

const DownloadButtonWrapper = styled.button`
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  background: linear-gradient(45deg, #852de5, #5c38c1);
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: var(--standartBorderRadius3);
  position: relative;
  overflow: hidden;
  z-index: 2;
  margin: 8px 0;

  @keyframes button-animation-out {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .inner-button {
    z-index: 1;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner-button-content {
      width: 100%;
      height: 100%;
    }

    .inner-button-success {
      animation: button-animation-out 2s forwards;
    }

    .inner-button-text {
      cursor: pointer;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        margin-right: 7px;
        width: 20px;
        height: 20px;
      }
    }

    .inner-button-download {
      width: 100%;
      background: red;

      input[type="file"] {
        /* display: none; */
        width: 100%;
        height: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: none;
      }
    }
  }

  &::before {
    content: "";
    position: absolute;
    display: block;
    top: 50%;
    left: 0%;
    transform: translateY(-50%);
    background: var(--green);
    width: ${(props) => (props.completed ? "100%" : "0")};
    height: 100%;
    transition: 0.6s;
    z-index: 0;
  }

  .LoadingCircle {
    position: relative;
    transform: none;
    left: auto;
    top: auto;
    width: 30px;
    height: 30px;

    img {
      width: 30px;
      height: 30px;
    }
  }
`;

const DownloadButton = ({
  title = "",
  text,
  place,
  setItemSrc,
  setImageLocalPath,
}) => {
  const { openBottomMessage } = useModal();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function onFileChange(e, place, setFunc) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    setCompleted(false);
    const isImage =
      place === "songsImages/" ||
      place === "usersImages/" ||
      place === "chatCovers/";
    const file = e.target.files[0];
    let isValid = false;
    if (isImage) {
      const validExtensions = [".jpg", ".png", ".jpeg"];
      if (
        validExtensions.find(
          (ext) =>
            file.name.substr(file.name.length - ext.length, ext.length) === ext
        )
      )
        isValid = true;
      else {
        setErrorMessage(
          `Format of your file is not valid. Download file with one of these: ${validExtensions.map(
            (ex) => " " + ex
          )}`
        );
        setLoading(false);
      }
    } else if (place === "songs/") {
      const validExtensions = [".mp3", ".mp4a", ".flac", ".wav", ".wma"];
      if (
        validExtensions.find(
          (ext) =>
            file.name.substr(file.name.length - ext.length, ext.length) === ext
        )
      )
        isValid = true;
      else {
        setErrorMessage(
          `Format of your file is not valid. Download file with one of these: ${validExtensions.map(
            (ex) => ex
          )}`
        );
        setLoading(false);
      }
    }

    if (isValid) {
      if (isImage) setImageLocalPath(URL.createObjectURL(file));
      const storageRef = storage.ref();
      const fileRef = storageRef.child(place + file.name);
      await fileRef.put(file);
      setCompleted(true);
      setLoading(false);
      setFunc(await fileRef.getDownloadURL());
    }
  }

  useEffect(() => {
    if (errorMessage.length) openBottomMessage(errorMessage, "failure");
  }, [errorMessage]);

  return (
    <>
      {!!title && <h3>{title}</h3>}
      <DownloadButtonWrapper completed={completed}>
        <div className="inner-button">
          {completed ? (
            <div className="inner-button-success">
              <ImCheckmark /> Done
            </div>
          ) : !loading ? (
            <div className="inner-button-content">
              <label className="inner-button-download">
                <div className="inner-button-text">
                  <AiOutlineCloudDownload />
                  {text}
                </div>
                <input
                  type="file"
                  name=""
                  id=""
                  onChange={(e) => onFileChange(e, place, setItemSrc)}
                />
              </label>
            </div>
          ) : (
            <LoadingCircle top={0} />
          )}
        </div>
      </DownloadButtonWrapper>
    </>
  );
};

export default DownloadButton;
