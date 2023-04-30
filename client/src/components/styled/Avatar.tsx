import React from "react";
import { activityStatus } from "../../store/user";

import "../../css/avatar.css";

type props = {
  src?: string;
  size?: string;
  status?: activityStatus;
  style?: React.CSSProperties;
  hoverInfo?: string;
  hoverDirection?: "left" | "right";
};

const Avatar = ({
  src,
  size,
  status,
  style,
  hoverInfo,
  hoverDirection,
}: props) => {
  const getColorStatus = () => {
    switch (status) {
      case "online":
        return "green";
      case "offline":
        return "gray";
      case "away":
        return "gold";
      case "doNotDisturb":
        return "red";
      case "hidden":
        return "gray";
      default:
        return "gray";
    }
  };

  return (
    <div className="avatar" style={{ width: size || "40px", ...style }}>
      {src && (
        <>
          <img className="avatar__img" src={src} alt="User avatar." />
          {status && (
            <div
              className="avatar__status"
              style={{ backgroundColor: getColorStatus() }}
            ></div>
          )}
          {hoverInfo && (
            <p
              className="avatar__description"
              style={
                hoverDirection === "left" ? { left: "5px" } : { right: "5px" }
              }
            >
              {hoverInfo}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Avatar;
