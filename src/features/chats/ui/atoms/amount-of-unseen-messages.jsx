import React from "react";
export const AmountOfUnseenMessages = ({ amountOfUnseen }) => {
  return (
    amountOfUnseen !== 0 && (
      <div className="AmountOfUnseenMessages">{amountOfUnseen}</div>
    )
  );
};
