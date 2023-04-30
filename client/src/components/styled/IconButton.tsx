import React from "react";

//Css
import "../../css/button.css";

type props = {
  icon: string;
  variant?: "normal" | "clear";
  color?: React.CSSProperties["color"];
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
  color = "rgb(124, 122, 255)",
}: props) => {
  return (
    <button
      className={`icon-button ${variant === "clear" && "iconButton--clear"}`}
      style={{
        ...style,
        ...(variant !== "clear" && { backgroundColor: color }),
      }}
      onClick={onClick}
      type={type}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
};

export default IconButton;
