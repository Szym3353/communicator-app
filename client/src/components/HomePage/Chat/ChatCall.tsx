import React from "react";
import { useSelector } from "react-redux";
import { useCall } from "../../../Context/callContext";

import "../../../css/call.css";
import { RootState } from "../../../store";
import IconButton from "../../styled/IconButton";
import VideoPlayer from "./VideoPlayer";

const ChatCall = ({ chatId }: { chatId: string }) => {
  const chat = useSelector((state: RootState) =>
    state.chat.data.chats.find((el) => el._id === chatId)
  );
  const {
    calls,
    myDevices,
    myStream,
    contactStream,
    toggle,
    contactDevices,
    leaveCall,
  } = useCall();

  const myRef = React.useRef<any>();
  const contactRef = React.useRef<any>();
  const currentCall = React.useMemo(() => {
    return calls.find((el) => el.chatId === chatId);
  }, [calls]);

  React.useEffect(() => {
    if (myStream && myRef.current) {
      myRef.current.srcObject = myStream;
    }
    if (contactStream && contactRef.current) {
      contactRef.current.srcObject = contactStream;
    }
  }, [myStream, contactStream, currentCall]);

  return currentCall && chat?._id === currentCall.chatId ? (
    <div className="call">
      {currentCall?.accepted && (
        <>
          <div className="call__users">
            <VideoPlayer
              user={currentCall.users[0]}
              stream={myStream}
              devices={myDevices}
            />
            <VideoPlayer
              user={currentCall.users[1]}
              stream={contactStream}
              devices={contactDevices}
            />
          </div>

          <div className="call__buttons">
            <IconButton
              onClick={() => toggle("audio")}
              icon={myDevices.audio ? "mic" : "mic_off"}
            />
            <IconButton
              style={{ margin: "0 30px" }}
              onClick={() => toggle("video")}
              icon={myDevices.video ? "videocam" : "videocam_off"}
            />
            <IconButton
              icon="phone_disabled"
              color={"red"}
              style={{ color: "white" }}
              onClick={() => leaveCall(chatId)}
            />
          </div>
        </>
      )}
    </div>
  ) : (
    <></>
  );
};

export default ChatCall;
