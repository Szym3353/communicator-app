import React, { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import { socket } from "../socket";
import { AppDispatch, RootState } from "../store";
import { call, chatUser, getChatRoom } from "../store/chat";

type tracks = {
  audio: boolean;
  video: boolean;
};

type fullCall = {
  accepted: boolean;
  users: chatUser[];
  signal: Peer.SignalData;
} & call;

type valuesType = {
  answerCall: (arg: string) => void;
  callUser: (arg: string) => void;
  calls: fullCall[];
  myStream: MediaStream | null;
  contactStream: MediaStream | null;
  toggle: (arg: "audio" | "video") => void;
  myDevices: tracks;
  contactDevices: tracks;
  leaveCall: (arg: string) => void;
};

const callContext = React.createContext<valuesType>({} as valuesType);

export function useCall() {
  return React.useContext(callContext);
}

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.data);
  const chats = useSelector((state: RootState) => state.chat.data.chats);
  const dispatch = useDispatch<AppDispatch>();
  const [calls, setCalls] = React.useState<fullCall[]>([]);
  const [myStream, setMyStream] = React.useState<MediaStream | null>(null);
  const [contactStream, setContactStream] = React.useState<MediaStream | null>(
    null
  );

  let peer: Peer.Instance | null = null;

  let tracks = { audio: true, video: true };
  const [myDevices, setMyDevices] = React.useState(tracks);
  const [contactDevices, setContactDevices] = React.useState(tracks);

  const connectionRef = React.useRef<null | Peer.Instance>(null);

  function callEdit(
    action: "addCall" | "addUser",
    {
      call,
      chatId,
      stream,
    }: { call?: fullCall; chatId?: string; stream?: MediaStream }
  ) {
    switch (action) {
      case "addCall":
        if (!call) return;
        if (calls.findIndex((el) => el.chatId === call.chatId) !== -1) return;
        setCalls((prev) => [...prev, call]);
        break;
      case "addUser":
        if (!chatId || !stream) return;
        let chat = chats.find((el) => el._id === chatId);
        setCalls((prev) =>
          prev.map((el) => {
            return el.chatId === chatId && chat
              ? {
                  ...el,
                  users: [...el.users, { ...chat.contactUser }],
                }
              : el;
          })
        );
        setContactStream(stream);
        setContactDevices({
          audio: stream.getAudioTracks()[0].enabled,
          video: stream.getVideoTracks()[0].enabled,
        });
        break;
    }
  }

  React.useEffect(() => {
    socket.on("call:receive", (payload: fullCall) => {
      callEdit("addCall", { call: payload });
    });

    socket.on(
      "call:toggle",
      (payload: { arg: "video" | "audio"; userId: string }) => {
        if (payload) {
          setContactDevices((prev) => ({
            ...prev,
            [payload.arg]: !prev[payload.arg],
          }));
        }
      }
    );

    socket.on("call:userLeft", (payload) => {
      leaveCall(payload.chatId);
    });

    return () => {
      socket.off("call:receive");
      socket.off("call:userLeft");
      socket.off("call:toggle");
    };
  }, [calls]);

  function toggle(arg: "audio" | "video") {
    setMyDevices((prev) => ({ ...prev, [arg]: !prev[arg] }));
    if (!myStream) return;

    socket.emit("call:toggle", {
      userId: user?._id,
      arg,
      chatId: calls.find(
        (el) => el.users.findIndex((callUser) => callUser.id) !== -1
      )?.chatId,
    });

    switch (arg) {
      case "audio":
        myStream.getAudioTracks()[0].enabled =
          !myStream.getAudioTracks()[0].enabled;
        break;
      case "video":
        myStream.getVideoTracks()[0].enabled =
          !myStream.getVideoTracks()[0].enabled;
        break;
    }
  }

  function getMediaDevices(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          currentStream.getAudioTracks()[0].enabled = myDevices.audio;
          currentStream.getVideoTracks()[0].enabled = myDevices.video;
          setMyStream(currentStream);
          resolve(currentStream);
        });
    });
  }

  async function answerCall(chatId: string) {
    let answeredCall = calls.find((el) => el.chatId === chatId);

    if (!user) return;
    setCalls((prev) =>
      prev.map((el) =>
        el.chatId === chatId
          ? {
              ...el,
              accepted: true,
              users: [
                {
                  id: user._id,
                  avatarURL: user.avatarURL,
                  username: user.username,
                },
                ...el.users,
              ],
            }
          : el
      )
    );

    let stream = await getMediaDevices();
    peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call:accept", {
        signalData: data,
        chatId: chatId,
        userId: user?._id,
      });
    });

    peer.on("stream", (currentStream) => {
      callEdit("addUser", {
        chatId,
        stream: currentStream,
      });
      dispatch(
        getChatRoom(
          answeredCall?.users.find((el) => el.id !== user?._id)?.id || ""
        )
      );
    });

    let call = calls.find((el) => el.chatId === chatId);
    if (!call || !call.signal) return;
    peer.signal(call.signal);

    connectionRef.current = peer;
  }

  async function callUser(chatId: string) {
    let stream = myStream ? myStream : await getMediaDevices();
    peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit(
        "call:start",
        {
          signal: data,
          chatId: chatId,
          userId: user?._id,
        },
        async (res: fullCall | null, error: string) => {
          if (error) return console.log("callError", error);

          if (!res) return;
          callEdit("addCall", { call: res });
        }
      );
    });

    peer.on("stream", (currentStream) => {
      callEdit("addUser", {
        chatId,
        stream: currentStream,
      });
    });

    socket.on("call:join", (payload) => {
      if (peer) peer.signal(payload.signal);
    });
  }

  function leaveCall(chatId: string) {
    let call = calls.find((el) => el.chatId === chatId);
    if (!call) return;

    setCalls((prev) => prev.filter((el) => el.chatId !== chatId));
    setMyDevices(tracks);
    setContactDevices(tracks);
    setMyStream(null);
    setContactStream(null);

    socket.emit("call:leave", { chatId, userId: user?._id });

    if (peer) peer.destroy();
    socket.off("call:join");
  }

  const values = {
    answerCall,
    callUser,
    calls,
    myStream,
    contactStream,
    toggle,
    myDevices,
    contactDevices,
    leaveCall,
  };
  return <callContext.Provider value={values}>{children}</callContext.Provider>;
};
