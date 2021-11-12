import React, { useContext, useState } from "react";

const ModalContext = React.createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

export const ModalClassProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState(<h1>Test</h1>);
  const [bottomMessage, setBottomMessage] = useState({
    isOpenned: false,
    type: "success",
    message: "Action is successfully done!",
  });
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    confirmText: "Confirm Action",
    rejectText: "Cancel",
    onConfirmL: () => {
      return null;
    },
    onReject: () => {
      return null;
    },
  });
  function toggleModal() {
    setOpenModal(!openModal);
  }

  //{question:question, confirmText:..., rejectText:..., onConfirm..., onReject:...}
  function openConfirm(
    question,
    confirmText,
    rejectText = "Cancel",
    onConfirm,
    onReject = closeConfirm
  ) {
    setIsOpenConfirm(true);
    setConfirmContent({
      question: question,
      confirmText: confirmText,
      rejectText: rejectText,
      onConfirm: onConfirm,
      onReject: onReject,
    });
  }

  function closeConfirm() {
    setIsOpenConfirm(false);
  }

  const openBottomMessage = (
    message = "Success",
    type = "success",
    time = 3000
  ) => {
    setBottomMessage({
      isOpenned: true,
      type: type,
      message: message,
    });

    setTimeout(() => {
      setBottomMessage({
        isOpenned: false,
        type: type,
        message: message,
      });
    }, time);
  };

  const value = {
    openModal,
    setOpenModal,
    toggleModal,
    setContent,
    content,
    isOpenConfirm,
    setIsOpenConfirm,
    openConfirm,
    closeConfirm,
    confirmContent,
    bottomMessage,
    openBottomMessage,
  };
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
