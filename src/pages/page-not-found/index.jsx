import React from "react";
import { useHistory } from "react-router-dom";
import "./style.css";

const PageNotFound = () => {
  const history = useHistory();
  return (
    <div className="PageNotFound">
      <img
        loading="lazy"
        src="https://i.pinimg.com/originals/b2/3d/f6/b23df649311586e74a8455c92eb3d76b.png"
        alt=""
      />
      <h2>Page not found</h2>
      <button
        className="standartButton"
        onClick={() => history.push("/library")}
      >
        Back to library
      </button>
    </div>
  );
};

export default PageNotFound;
