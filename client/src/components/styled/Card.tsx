import React, { ReactNode } from "react";

type props = {
  children: ReactNode;
  title?: string;
  subHeader?: string;
  containerStyles?: React.CSSProperties;
  titleStyles?: React.CSSProperties;
  subHeaderStyles?: React.CSSProperties;
};

const styles = {
  container: {
    display: "inline-block",
    padding: "15px",
    boxShadow: "1px 3px 8px rgba(0,0,0,0.34)",
    backgroundColor: "#fff",
    borderRadius: "5px",
  },
  title: {
    fontSize: "27px",
    margin: 0,
    fontWeight: 400,
  },
  subHeader: {
    fontSize: "16px",
    color: "#222",
  },
  content: {
    marginTop: "15px",
  },
};

const Card = ({
  title,
  subHeader,
  children,
  containerStyles,
  titleStyles,
  subHeaderStyles,
}: props) => {
  return (
    <div style={{ ...styles.container, ...containerStyles }}>
      {title && <h3 style={{ ...styles.title, ...titleStyles }}>{title}</h3>}
      {subHeader && (
        <p style={{ ...styles.subHeader, ...subHeaderStyles }}>{subHeader}</p>
      )}
      <div style={styles.content}>{children}</div>
    </div>
  );
};

export default Card;
