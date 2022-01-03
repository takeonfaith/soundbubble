import React from "react";
import displayDate from "../../../../shared/lib/display-date";

export const DateOnTop = ({ date }) => {
  return <div className="DateOnTop">{displayDate(date)}</div>;
};
