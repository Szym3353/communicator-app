import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useClickObserver from "../../../Hooks/useClickObserver";
import { AppDispatch } from "../../../store";
import { clearChatStore } from "../../../store/chat";
import { clearUserStore } from "../../../store/user";
import IconButton from "../../styled/IconButton";

const SideBarUserOptions = () => {
  let dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();
  const ref = React.useRef<HTMLUListElement>(null);
  let { show, setShow } = useClickObserver(ref);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = `${!show ? "0px" : "60px"}`;
  }, [show]);

  const logout = () => {
    dispatch(clearUserStore());
    dispatch(clearChatStore());
    navigate("/login");
  };

  return (
    <div style={{ position: "relative" }}>
      <IconButton
        onClick={() => setShow(true)}
        variant="clear"
        icon="more_vert"
      />
      <ul ref={ref} className="sidebar-options-menu">
        <li className="sidebar-option">Settings</li>
        <li className="sidebar-option" onClick={logout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default SideBarUserOptions;
