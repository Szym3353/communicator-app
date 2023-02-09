import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

import "../../../css/chatroom.css";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatContainerTop from "./ChatContainerTop";

const ChatContainer = () => {
  const selectedChat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id == state.chat.data.selectedChat)
  );

  return (
    <div className="homepage-chat-container">
      <ChatContainerTop />
      {selectedChat === undefined ? (
        <div className="homepage-chat-null">
          <p>Select any chat</p>
          <span className="material-symbols-outlined">forum</span>
        </div>
      ) : (
        <>
          <ChatMessages />
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default ChatContainer;
