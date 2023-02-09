import React from "react";

//Css
import "../../css/button.css";

type props = {
  icon: string;
  variant?: "normal" | "clear";
  style?: React.CSSProperties;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
};

const IconButton = ({
  icon,
  variant = "normal",
  style,
  onClick,
  type = "button",
}: props) => {
  return (
    <button
      className={`icon-button ${variant === "clear" && "icon-button-clear"}`}
      style={style}
      onClick={onClick}
      type={type}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
};

export default IconButton;
