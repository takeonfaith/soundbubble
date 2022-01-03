import React from "react";
import styled from "styled-components";

const OnlineCircleAnimationWrapper = styled.div`
  width: 10px;
  height: 10px;
  background: var(--red);
  box-shadow: 0 0 10px var(--red);
  border-radius: 100%;
  position: relative;

  @keyframes waveAnimation {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    60% {
      opacity: 0.5;
      transform: scale(2);
    }
    100% {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    background: var(--red);
    filter: brightness(0.3);
    border-radius: 100%;
    animation: waveAnimation 1.5s infinite;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
`;

const OnlineCircleAnimation = () => {
  return <OnlineCircleAnimationWrapper></OnlineCircleAnimationWrapper>;
};

export default OnlineCircleAnimation;
