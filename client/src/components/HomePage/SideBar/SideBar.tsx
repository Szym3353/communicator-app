import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import FindContacts from "./FindContacts";
import SingleContact from "./SingleContact";

import "../../../css/sidebar.css";
import Avatar from "../../styled/Avatar";
import useClickObserver from "../../../Hooks/useClickObserver";
import { toggleShowContacts } from "../../../store/user";
import useWidthObserver from "../../../Hooks/useWidthObserver";
import IconButton from "../../styled/IconButton";
import { useCall } from "../../../Context/callContext";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();

  //User
  const userData = useSelector((state: RootState) => state.user.data);
  const { myDevices, toggle } = useCall();

  //Contacts data
  const [showOption, setShowOption] = React.useState<"friends" | "all">(
    "friends"
  );
  let contacts = React.useMemo(() => {
    return showOption === "friends"
      ? userData?.contacts.filter((el) => el.contactType === "friend")
      : userData?.contacts;
  }, [showOption, userData?.contacts]);

  //Mobile visibility toggle
  const dispatch = useDispatch();
  const { windowWidth } = useWidthObserver();

  let sideBarRef = React.useRef<HTMLDivElement>(null);

  const showContacts = useSelector(
    (state: RootState) => state.user.showContacts
  );
  const { show, setShow } = useClickObserver(sideBarRef);

  React.useEffect(() => {
    setShow(showContacts);
  }, [showContacts]);

  React.useEffect(() => {
    if (windowWidth >= 800) {
      dispatch(toggleShowContacts(true));
    } else {
      dispatch(toggleShowContacts(false));

      if (!sideBarRef.current) return;
      sideBarRef.current.style.left = "-350px";
    }
  }, [windowWidth]);

  React.useEffect(() => {
    if (!sideBarRef.current) return;
    if (windowWidth >= 800) {
      sideBarRef.current.style.left = "0px";
      return;
    }
    if (!show) dispatch(toggleShowContacts(false));
    sideBarRef.current.style.left = `${show ? "0px" : "-350px"}`;
  }, [show]);

  return (
    <div className="sidebar" ref={sideBarRef}>
      <div className="sidebar__top">
        <div className="sidebar-top__user">
          <Avatar
            status={userData?.activityStatus.currentStatus}
            src={userData?.avatarURL || ""}
            size="40px"
            style={{ marginLeft: "0" }}
          />
          <div className="sidebar-top__user-info">
            <h3 className="sidebar-top__user-name">
              {userData?.username || "username"}
            </h3>
            <span className="sidebar-top__user-code">#{userData?.code}</span>
          </div>
        </div>
        <div className="sidebar-top__menu">
          <IconButton
            icon={`${myDevices.audio ? "mic" : "mic_off"}`}
            variant="clear"
            onClick={() => toggle("audio")}
          />
          <IconButton
            icon="settings"
            onClick={() => navigate("/settings")}
            style={{ marginLeft: "10px" }}
            variant="clear"
          />
        </div>
      </div>
      <div className="sidebar__contacts scrollbar">
        <div className="sidebar-contacts__menu">
          <button
            onClick={() => setShowOption("friends")}
            className={`sidebar-contacts__menu-button ${
              showOption === "friends" &&
              "sidebar-contacts__menu-button--selected"
            }`}
          >
            <span className="material-symbols-outlined">group</span>
            <span className="sidebar-contacts__menu-button-text">friends</span>
          </button>
          <button
            onClick={() => setShowOption("all")}
            className={`sidebar-contacts__menu-button ${
              showOption === "all" && "sidebar-contacts__menu-button--selected"
            }`}
          >
            <span className="material-symbols-outlined">forum</span>
            <span className="sidebar-contacts__menu-button-text">
              all chats
            </span>
          </button>
        </div>
        <div className="sidebar-contacts__list">
          {contacts?.map((contact) => (
            <SingleContact key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
      <FindContacts />
    </div>
  );
};

export default SideBar;
