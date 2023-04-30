import React from "react";

export default function useClickObserver(ref: React.RefObject<any>) {
  const [show, setShow] = React.useState<boolean>(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return { show, setShow };
}
