import React from "react";
import "../../css/input.css";

type props = {
  label: string;
  labelStyles?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
  onChange: (arg: string) => void;
  type?: React.HTMLInputTypeAttribute;
  color?: React.CSSProperties["color"];
  value?: string;
};

const Input = ({
  label,
  labelStyles,
  inputStyles,
  onChange,
  type = "text",
  value,
  color = "#0550b3",
}: props) => {
  return (
    <div className="input-container">
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="input-input"
        value={value}
        style={{
          ...inputStyles,
        }}
      />
      <label className="input-label" style={{ ...labelStyles }}>
        {label}:
      </label>
      <span className="input-focus-border" style={{ borderColor: color }} />
    </div>
  );
};

export default Input;
