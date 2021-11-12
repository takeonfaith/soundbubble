import React from "react";

export const ContentContainer = ({ children, ...props }) => {
  return (
    <div className="content-container" {...props}>
      {children}
    </div>
  );
};
