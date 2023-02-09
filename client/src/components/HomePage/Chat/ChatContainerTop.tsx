import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { toggleShowContacts } from "../../../store/user";
import Avatar from "../../styled/Avatar";
import IconButton from "../../styled/IconButton";

const ChatContainerTop = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id == state.chat.data.selectedChat)
  );

  return (
    <div className="chat-top">
      <div className="show-sidebar-button">
        <IconButton
          variant="clear"
          icon="menu"
          onClick={() => dispatch(toggleShowContacts(true))}
        />
      </div>
      {selectedChat && (
        <>
          <div className="chat-top-user">
            <Avatar src={selectedChat.contactUser.avatarURL} />
            <p className="chat-top-username">
              {selectedChat.contactUser.username}
            </p>
          </div>
          <div className="chat-top-buttons">
            <IconButton icon="call" />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatContainerTop;
