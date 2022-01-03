import React from "react";
import Logo from "../../../../shared/ui/images/Logo3.svg";
export const LoadingData = () => {
  return (
    <div className="LoadingData">
      <img loading="lazy" src={Logo} alt="" />
    </div>
  );
};
