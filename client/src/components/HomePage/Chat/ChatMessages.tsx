import React from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getMessages } from "../../../store/chat";
import Avatar from "../../styled/Avatar";

const ChatMessages = () => {
  const { ref, inView } = useInView();
  const dispatch = useDispatch<AppDispatch>();

  const selectedChat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id == state.chat.data.selectedChat)
  );

  React.useEffect(() => {
    if (inView) {
      dispatch(getMessages(""));
    }
  }, [inView, selectedChat]);

  return (
    <ul className="chat-messages-list scrollbar">
      {selectedChat?.messages &&
        selectedChat?.messages.map((message) => (
          <li
            key={message._id}
            className={`chat-message ${
              message.author === selectedChat.loggedUser.id &&
              "logged-user-message"
            }`}
          >
            <Avatar
              src={
                message.author === selectedChat.contactUser.id
                  ? selectedChat.contactUser.avatarURL
                  : selectedChat.loggedUser.avatarURL
              }
            />
            <span
              className={`message-content ${
                message.author === selectedChat.loggedUser.id &&
                "logged-user-message-content"
              }`}
            >
              {message.content}
            </span>
          </li>
        ))}
      <li className="chat-text-hr" ref={ref}>
        End of chat
      </li>
    </ul>
  );
};

export default ChatMessages;
