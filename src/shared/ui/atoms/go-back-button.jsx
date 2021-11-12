import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useHistory } from "react-router";
import { Hint } from "./hint";

export const GoBackBtn = ({ color = "" }) => {
  const history = useHistory();
  return (
    <div className="GoBackBtn">
      <button
        onClick={() => history.goBack()}
        style={color.length ? { color: color } : {}}
      >
        <Hint text={"go back"} direction={"bottom"} />
        <FiArrowLeft />
      </button>
    </div>
  );
};
