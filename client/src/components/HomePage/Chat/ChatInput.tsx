import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../socket";
import { AppDispatch, RootState } from "../../../store";
import { message, pushMessage } from "../../../store/chat";
import IconButton from "../../styled/IconButton";

const ChatInput = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputValue, setInputValue] = React.useState<string>("");

  const selectedChat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id == state.chat.data.selectedChat)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || inputValue.trim() === "") return;

    setInputValue("");

    socket.emit(
      "message:send",
      {
        chatId: selectedChat?._id,
        authorId: selectedChat?.loggedUser.id,
        message: inputValue,
      },
      (res: message & { chatId: string }) => {
        if (res) {
          dispatch(pushMessage(res));
        }
      }
    );
  };

  return (
    <div className="chat-input-container">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setInputValue(e.target.value)}
          className="chat-input"
          type="text"
          value={inputValue}
        />
        <IconButton type="submit" icon="send" />
      </form>
    </div>
  );
};

export default ChatInput;
