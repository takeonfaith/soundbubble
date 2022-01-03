import React, { useContext, useEffect, useState } from "react";

const ScreenContext = React.createContext();

export const useScreen = () => {
  return useContext(ScreenContext);
};

export const ScreenProvider = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  function handleResize() {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
    setIsMobile(window.innerWidth < 1000);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const value = {
    screenWidth,
    screenHeight,
    isMobile,
  };
  return (
    <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>
  );
};
