import React from "react";
import { useDispatch } from "react-redux";
import fetchHeaders from "../../../fetchHeaders";
import { AppDispatch } from "../../../store";
import { getChatRoom } from "../../../store/chat";
import { addContact, contact } from "../../../store/user";
import Avatar from "../../styled/Avatar";
import Button from "../../styled/Button";
import Input from "../../styled/Input";

const FindContacts = () => {
  let dispatch = useDispatch<AppDispatch>();
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchUsername, setSearchUsername] = React.useState("");
  const [searchCode, setSearchCode] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<contact[]>([]);

  const findContactRef = React.useRef<HTMLDivElement>(null);

  const handleShowFind = () => {
    setShowSearch((prev) => !prev);
    if (findContactRef.current == null) return;
    findContactRef.current.style.height = `${!showSearch ? "400px" : "0px"}`;
  };

  function selectResult(data: contact) {
    setShowSearch(false);
    dispatch(addContact(data));
    dispatch(getChatRoom(data.id));
  }

  async function fetchResults() {
    await fetch(
      `${process.env.REACT_APP_SERVER_URL}user/search/${
        searchUsername || 0
      }/${searchCode}`,
      { method: "GET", credentials: "include", headers: fetchHeaders }
    )
      .then((response) => response.json())
      .then((data) => setSearchResults(data));
  }

  React.useEffect(() => {
    if (searchCode.length >= 2 || searchUsername.length >= 2) {
      fetchResults();
    }
  }, [searchUsername, searchCode]);

  return (
    <>
      <div className="sidebar-invite-container">
        <Button
          onClick={handleShowFind}
          style={{ width: "100%" }}
          value={
            showSearch ? (
              "x"
            ) : (
              <>
                <span>Find new contacts</span>
                <span className="material-symbols-outlined">search</span>
              </>
            )
          }
        />
      </div>
      <div ref={findContactRef} className="find-contacts-container">
        <Input
          label="Username"
          onChange={(value) => setSearchUsername(value)}
        />
        <Input
          label="Invitation Code"
          onChange={(value) => setSearchCode(value)}
        />
        <ul className="find-contacts-list scrollbar">
          {searchResults.map((el) => (
            <li
              key={el.id}
              className="find-contacts-element"
              onClick={() => selectResult(el)}
            >
              <Avatar src={el.avatarURL} /> <span>{el.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FindContacts;
