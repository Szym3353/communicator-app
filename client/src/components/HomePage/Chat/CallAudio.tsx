import React from "react";
import { useCall } from "../../../Context/callContext";

const CallAudio = () => {
  let { contactStream } = useCall();

  let contactAudio = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (!contactAudio.current) return;

    if (contactStream) {
      contactAudio.current.srcObject = contactStream;
    } else {
      contactAudio.current.srcObject = null;
    }
  }, [contactStream]);

  return <audio ref={contactAudio} autoPlay className="call__global-audio" />;
};

export default CallAudio;
