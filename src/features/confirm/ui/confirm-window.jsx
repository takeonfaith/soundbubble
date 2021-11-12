import React, { useRef } from "react";
import { useModal } from "../../../contexts/modal";
import useOutsideClick from "../../../shared/lib/hooks/use-outside-click";

export const ConfirmWindow = () => {
  const { isOpenConfirm, confirmContent, setIsOpenConfirm } = useModal();
  const confirmRef = useRef(null);
  useOutsideClick(confirmRef, setIsOpenConfirm);
  return (
    <div
      className="modal_darkBg confirm"
      style={!isOpenConfirm ? { opacity: 0, visibility: "hidden" } : {}}
    >
      <div
        className="ConfirmWindow"
        ref={confirmRef}
        style={!isOpenConfirm ? { transform: "translateY(40px)" } : {}}
      >
        <h3>{confirmContent.question}</h3>
        <div className="confirmButtons">
          <button onClick={confirmContent.onConfirm} className="standartButton">
            {confirmContent.confirmText}
          </button>
          <button onClick={confirmContent.onReject} className="standartButton">
            {confirmContent.rejectText}
          </button>
        </div>
      </div>
    </div>
  );
};
