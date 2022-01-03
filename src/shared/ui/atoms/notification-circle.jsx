import React from "react";
import styled from "styled-components";
import bigNumberFormat from "../../lib/big-number-format";

const NotificationCircleWrapper = styled.div`
  border-radius: 100%;
  width: 20px;
  height: 20px;
  font-size: 0.7em;
  background: var(--red);
  color: #fff;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`;

export const NotificationCircle = ({ value }) => {
  return (
    !!value && (
      <NotificationCircleWrapper className="notification-circle">
        {bigNumberFormat(value)}
      </NotificationCircleWrapper>
    )
  );
};
