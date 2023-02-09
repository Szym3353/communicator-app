import React from "react";
import { activityStatus } from "../../store/user";

import "../../css/avatar.css";

type props = {
  src: string;
  size?: string;
  status?: activityStatus;
};

const Avatar = ({ src, size, status }: props) => {
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
    <div className="avatar-container" style={{ width: size || "40px" }}>
      <img className="avatar-img" src={src} />
      {status && (
        <div
          className="avatar-status"
          style={{ backgroundColor: getColorStatus() }}
        ></div>
      )}
    </div>
  );
};

export default Avatar;
