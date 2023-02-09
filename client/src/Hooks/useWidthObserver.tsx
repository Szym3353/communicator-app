import React from "react";

export default function useWidthObserver() {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  const handleResizeEvent = (e: UIEvent) => {
    setWindowWidth(window.innerWidth);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResizeEvent);
    return () => {
      window.removeEventListener("resize", handleResizeEvent);
    };
  }, []);

  return { windowWidth };
}
