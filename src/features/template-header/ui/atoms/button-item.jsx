import React from "react";
import { Hint } from "../../../../components/Basic/Hint";

const ButtonItem = ({ icon, hint, action }) => {
  return (
    <button onClick={action}>
      <Hint text={hint} direction="bottom" />
      {icon}
    </button>
  );
};

export default ButtonItem;
