import React from "react";

const ColorCircles = ({ play }) => {
  return (
    <div
      className="ColorCircles"
      style={!play ? { opacity: 0, transform: "scale(.95)" } : {}}
    >
      <span className="colorCircle"></span>
      <span className="colorCircle"></span>
      <span className="colorCircle"></span>
    </div>
  );
};

export default ColorCircles;
