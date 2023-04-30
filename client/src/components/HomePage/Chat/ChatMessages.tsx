import React from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import useEmoji from "../../../Hooks/useEmoji";
import { AppDispatch, RootState } from "../../../store";
import { getMessages, message } from "../../../store/chat";
import Avatar from "../../styled/Avatar";

const ChatMessages = () => {
  const { emojify } = useEmoji();
  const { ref, inView } = useInView();
  const dispatch = useDispatch<AppDispatch>();

  const selectedChat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id === state.chat.data.selectedChat)
  );

  const lastReadIndex = React.useMemo(() => {
    return selectedChat?.messages.findIndex((el) =>
      el.read.includes(selectedChat.contactUser.id)
    );
  }, [selectedChat]);

  const showAvatar = (isAuthor: boolean, index: number): JSX.Element => {
    if (!selectedChat) return <></>;

    let returnedAvatar = (
      <Avatar
        src={
          isAuthor
            ? selectedChat.loggedUser.avatarURL
            : selectedChat.contactUser.avatarURL
        }
        hoverInfo="testestest"
        hoverDirection={!isAuthor ? "left" : "right"}
      />
    );

    if (!selectedChat.messages[index + 1]) return returnedAvatar;

    if (
      selectedChat.messages[index + 1].author ===
      selectedChat.messages[index].author
    ) {
      return <Avatar />;
    } else {
      return returnedAvatar;
    }
  };

  const isMessageAuthor = (message: message) =>
    message.author === selectedChat?.loggedUser.id;

  React.useEffect(() => {
    if (inView) {
      dispatch(getMessages(""));
    }
  }, [inView, selectedChat]);

  return (
    <ul className="chat-messages scrollbar">
      {selectedChat?.messages &&
        selectedChat?.messages.map((message, index: number) => (
          <li
            key={message._id}
            className={`chat-message ${
              isMessageAuthor(message) && "is-loggedUser"
            }`}
          >
            {showAvatar(isMessageAuthor(message), index)}
            <span
              className={`chat-message__content ${
                isMessageAuthor(message) && "is-loggedUser-content"
              }`}
            >
              {emojify(message.content)}
            </span>
            {index === lastReadIndex && (
              <div className="chat-message__read">
                <Avatar src={selectedChat.contactUser.avatarURL} size="15px" />
              </div>
            )}
          </li>
        ))}
      <li className="chat-text-hr" ref={ref}>
        End of chat
      </li>
    </ul>
  );
};

export default ChatMessages;
