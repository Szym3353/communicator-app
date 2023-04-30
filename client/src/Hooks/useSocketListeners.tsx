import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { AppDispatch, RootState } from "../store";
import { pushMessage, readMessages } from "../store/chat";
import { activityStatus, contactOnTop, updateContact } from "../store/user";

export default function useSocketListeners() {
  let dispatch = useDispatch<AppDispatch>();
  const selectedChat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id === state.chat.data.selectedChat)
  );
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on(
      "contact:changeStatus",
      (payload: { contactId: string; status: activityStatus }) => {
        dispatch(updateContact(payload));
      }
    );

    socket.on("message:read:author", (payload) => {
      dispatch(readMessages(payload));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("contact:changeStatus");
      socket.off("message:read:author");
    };
  }, []);

  React.useEffect(() => {
    socket.on("message:receive", (payload) => {
      if (!payload) return;
      dispatch(contactOnTop(payload.contact));
      dispatch(pushMessage(payload.message));
      if (selectedChat?._id === payload.message.chatId) {
        socket.emit("message:read:contact", {
          chatId: payload.message.chatId,
          messageAuthor: payload.message.author,
          userId: selectedChat?.loggedUser.id,
        });
      }
    });

    return () => {
      socket.off("message:receive");
    };
  }, [selectedChat]);

  return { isConnected, setIsConnected };
}
