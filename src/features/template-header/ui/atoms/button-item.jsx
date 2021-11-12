import React from "react";
import { Hint } from "../../../../shared/ui/atoms/hint";

const ButtonItem = ({ icon, hint, action }) => {
  return (
    <button onClick={action}>
      <Hint text={hint} direction="bottom" />
      {icon}
    </button>
  );
};

export default ButtonItem;
