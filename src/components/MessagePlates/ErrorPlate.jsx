import React, { useEffect } from "react";
import { useModal } from "../../contexts/ModalContext";

export const ErrorPlate = ({ errorMessage }) => {
  const { openBottomMessage } = useModal();
  useEffect(() => {
    if (errorMessage) {
      openBottomMessage(errorMessage, "failure");
    }
  }, [errorMessage]);
  return errorMessage && <div className="Alert">{errorMessage}</div>;
};
