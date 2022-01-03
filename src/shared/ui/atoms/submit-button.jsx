import React, { useEffect } from "react";
import { ImCheckmark } from "react-icons/im";
import styled from "styled-components";
import { LoadingCircle } from "../../../features/loading/ui/atoms/loading-circle";
import { useModal } from "../../../contexts/modal";

const SubmitButtonWrapper = styled.button`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  opacity: ${(props) => (props.isLoading || !props.isActive ? 0.5 : 1)};
  background: var(--purpleAndBlueGrad);
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: var(--standartBorderRadius3);
  position: relative;
  overflow: hidden;

  @keyframes button-animation-in {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  @keyframes button-animation-out {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .inner-button {
    z-index: 1;

    .inner-button-success {
      animation: button-animation-in 2s forwards;
    }

    .inner-button-text {
      animation: button-animation-out 0.5s forwards;
    }
  }

  &::before {
    content: "";
    position: absolute;
    display: block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--green);
    width: ${(props) => (props.completed ? "2000px" : "0")};
    height: ${(props) => (props.completed ? "2000px" : "0")};
    border-radius: 100%;
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

const SubmitButton = ({
  text,
  action,
  isLoading,
  completed = false,
  setCompleted,
  bottomMessage,
  isActive = true,
  errorMessage,
  setErrorMessage,
}) => {
  const { openBottomMessage } = useModal();

  useEffect(() => {
    if (completed) {
      openBottomMessage(bottomMessage ?? undefined);
      setTimeout(() => {
        setCompleted(false);
      }, 2000);
    }
  }, [bottomMessage, completed, openBottomMessage, setCompleted]);

  useEffect(() => {
    if (errorMessage) {
      openBottomMessage(errorMessage, "failure");
      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
    }
  }, [errorMessage, setErrorMessage, openBottomMessage]);

  return (
    <SubmitButtonWrapper
      isLoading={isLoading}
      className="submit-button"
      completed={completed}
      isActive={isActive}
      onClick={
        isActive
          ? action
          : () => !!errorMessage && openBottomMessage("Nope", "failure")
      }
    >
      <div className="inner-button">
        {completed ? (
          <div className="inner-button-success">
            <ImCheckmark /> Done
          </div>
        ) : !isLoading ? (
          <div className="inner-button-text">{text}</div>
        ) : (
          <LoadingCircle top={0} />
        )}
      </div>
    </SubmitButtonWrapper>
  );
};

export default SubmitButton;
