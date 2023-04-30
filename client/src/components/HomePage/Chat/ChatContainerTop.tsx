import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCall } from "../../../Context/callContext";
import { RootState } from "../../../store";
import { toggleShowContacts } from "../../../store/user";
import Avatar from "../../styled/Avatar";
import IconButton from "../../styled/IconButton";

const ChatContainerTop = () => {
  const dispatch = useDispatch();
  const { callUser } = useCall();
  const selectedChat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id === state.chat.data.selectedChat)
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
          <div className="chat-top__user">
            <Avatar src={selectedChat.contactUser.avatarURL} />
            <p className="chat-top__username">
              {selectedChat.contactUser.username}
            </p>
          </div>
          <div className="chat-top__buttons">
            <IconButton
              variant="clear"
              icon="call"
              onClick={() => callUser(selectedChat._id)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatContainerTop;
