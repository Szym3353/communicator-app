import React, { ReactNode } from "react";

import "../../css/card.css";

type props = {
  children: ReactNode;
  title?: string;
  subHeader?: string;
  containerStyles?: React.CSSProperties;
  titleStyles?: React.CSSProperties;
  subHeaderStyles?: React.CSSProperties;
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
    <div className="card" style={{ ...containerStyles }}>
      {title && (
        <h3 className="card__title" style={{ ...titleStyles }}>
          {title}
        </h3>
      )}
      {subHeader && (
        <p className="card__subHeader" style={{ ...subHeaderStyles }}>
          {subHeader}
        </p>
      )}
      <div className="card__content">{children}</div>
    </div>
  );
};

export default Card;
