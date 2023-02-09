import React from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket";
import { AppDispatch } from "../store";
import { pushMessage } from "../store/chat";
import { activityStatus, contactOnTop, updateContact } from "../store/user";

export default function useSocketListeners() {
  let dispatch = useDispatch<AppDispatch>();
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

    socket.on("message:receive", (payload) => {
      if (!payload) return;
      dispatch(contactOnTop(payload.contact));
      dispatch(pushMessage(payload.message));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("contact:changeStatus");
      socket.off("message:receive");
    };
  }, []);

  return { isConnected, setIsConnected };
}
