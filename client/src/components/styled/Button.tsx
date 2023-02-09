import React, { ReactNode } from "react";
import "../../css/button.css";

type props = {
  onClick: () => void;
  style?: React.CSSProperties;
  color?: React.CSSProperties["color"];
  value: string | ReactNode;
  outlined?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
};

const Button = ({
  onClick,
  style,
  color = "rgb(124, 122, 255)",
  value,
  outlined,
  type = "button",
}: props) => {
  return (
    <button
      onClick={onClick}
      className="button"
      type={type}
      style={{
        ...style,
        ...(outlined
          ? { border: `1px solid ${color}` }
          : { backgroundColor: `${color}` }),
      }}
    >
      {value}
    </button>
  );
};

export default Button;
