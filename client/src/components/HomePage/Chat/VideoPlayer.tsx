import React from "react";
import { chatUser } from "../../../store/chat";
import Avatar from "../../styled/Avatar";

const VideoPlayer = ({
  stream,
  devices,
  user,
}: {
  stream: MediaStream | null;
  devices: { audio: boolean; video: boolean };
  user: chatUser;
}) => {
  let videoRef = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    if (!videoRef.current) return;
    if (stream) videoRef.current.srcObject = stream;
    else {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  return stream && user ? (
    <div className="call-user">
      <>
        <div className="call-user__video">
          {!devices.audio && (
            <span className="material-symbols-outlined call-user--isMuted">
              mic_off
            </span>
          )}
          {!devices.video && (
            <Avatar size="170px" src={user.avatarURL} style={{ margin: 0 }} />
          )}
          <video
            playsInline
            ref={videoRef}
            autoPlay
            muted
            width={170}
            height={170}
            style={{ display: `${devices.video ? "block" : "none"}` }}
          />
        </div>
        <p className="call-user__username">{user.username}</p>
      </>
    </div>
  ) : (
    <></>
  );
};

export default VideoPlayer;
