import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

import "../../../css/chatroom.css";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatContainerTop from "./ChatContainerTop";
import ChatCall from "./ChatCall";

const ChatContainer = () => {
  const selectedChat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id === state.chat.data.selectedChat)
  );

  return (
    <div className="chat">
      <ChatContainerTop />
      {selectedChat === undefined ? (
        <div className="chat-null">
          <p className="chat-null__text">Select any chat</p>
          <span className="material-symbols-outlined chat-null__icon">
            forum
          </span>
        </div>
      ) : (
        <>
          <ChatCall chatId={selectedChat._id} />
          <ChatMessages />
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default ChatContainer;
