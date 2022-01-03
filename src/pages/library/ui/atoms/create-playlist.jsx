import React from "react";
import { FiPlus } from "react-icons/fi";
import styled from "styled-components";
import { AddPlaylist } from "../../../../features/author/ui/organisms/add-playlist";
import { useModal } from "../../../../contexts/modal";

const CreatePlaylistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--chatsColor);
  border-radius: var(--standartBorderRadius);
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s, 0.1s box-shadow;

  & .text {
    transition: 0.15s;
    height: 25px;
  }

  &:hover .add-circle {
    transform: scale(1.3);
  }

  &:hover .text {
    opacity: 0;
    height: 0;
  }

  &:hover {
    transform: scale(0.93);
  }

  &:active {
    transform: scale(0.9);
    box-shadow: 0 0 0 7px #ffffff5e;
  }

  & .add-circle {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    background: var(--playlistsColor);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    transition: 0.2s;

    svg {
      width: 30px;
      height: 30px;
    }
  }
`;

const CreatePlaylist = () => {
  const { toggleModal, setContent } = useModal();

  return (
    <CreatePlaylistWrapper
      onClick={() => {
        toggleModal();
        setContent(<AddPlaylist />);
      }}
      className="playlistItem"
    >
      <span className="add-circle">
        <FiPlus />
      </span>
      <span className="text">Add playlist</span>
    </CreatePlaylistWrapper>
  );
};

export default CreatePlaylist;
