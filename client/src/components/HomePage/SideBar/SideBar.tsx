import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import FindContacts from "./FindContacts";
import SingleContact from "./SingleContact";

import "../../../css/sidebar.css";
import SideBarUserOptions from "./SideBarUserOptions";
import Avatar from "../../styled/Avatar";
import useClickObserver from "../../../Hooks/useClickObserver";
import { toggleShowContacts } from "../../../store/user";
import useWidthObserver from "../../../Hooks/useWidthObserver";

const SideBar = () => {
  const { windowWidth } = useWidthObserver();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.data);
  const [showOption, setShowOption] = React.useState<"friends" | "all">(
    "friends"
  );

  let contacts = React.useMemo(() => {
    return showOption === "friends"
      ? userData?.contacts.filter((el) => el.contactType === "friend")
      : userData?.contacts;
  }, [showOption, userData?.contacts]);

  //Mobile visibility toggle
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
    }
  }, [windowWidth]);

  React.useEffect(() => {
    if (!sideBarRef.current) return;
    if (windowWidth >= 800) {
      sideBarRef.current.style.width = "350px";
      return;
    }
    if (!show) dispatch(toggleShowContacts(false));
    sideBarRef.current.style.width = `${show ? "350px" : "0px"}`;
  }, [show]);

  return (
    <div className="homepage-sidebar-container" ref={sideBarRef}>
      <div className="sidebar-top">
        <div className="sidebar-user">
          <Avatar src={userData?.avatarURL || ""} size="60px" />
          <div>
            <h3 className="sidebar-user-username">{userData?.username}</h3>
            <span className="sidebar-user-code">
              Invite code: {userData?.code}
            </span>
          </div>
        </div>
        <SideBarUserOptions />
      </div>
      <div className="sidebar-contacts scrollbar">
        <div className="sidebar-contacts-menu">
          <button
            onClick={() => setShowOption("friends")}
            className={`sidebar-contacts-button ${
              showOption === "friends" && "sidebar-contacts-button-selected"
            }`}
          >
            <span className="material-symbols-outlined">group</span>
            <span className="contacts-button-text">friends</span>
          </button>
          <button
            onClick={() => setShowOption("all")}
            className={`sidebar-contacts-button ${
              showOption === "all" && "sidebar-contacts-button-selected"
            }`}
          >
            <span className="material-symbols-outlined">forum</span>
            <span className="contacts-button-text">all chats</span>
          </button>
        </div>
        {contacts?.map((contact) => (
          <SingleContact key={contact.id} contact={contact} />
        ))}
      </div>
      <FindContacts />
    </div>
  );
};

export default SideBar;
