import React from "react";
import { useCall } from "../../../Context/callContext";
import Card from "../../styled/Card";
import IconButton from "../../styled/IconButton";

import "../../../css/call.css";
import Avatar from "../../styled/Avatar";

const AcceptCall = () => {
  const { calls, answerCall, leaveCall } = useCall();

  const currentCall = React.useMemo(() => {
    return calls.find((el) => el.accepted === false);
  }, [calls]);

  return currentCall ? (
    <Card
      containerStyles={{
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: "100",
        transform: "translate(-50%, -50%)",
        width: "200px",
        textAlign: "center",
      }}
    >
      <div className="accept-call">
        <p className="accept-call__username">{currentCall.users[0].username}</p>
        <Avatar
          src={currentCall.users[0].avatarURL}
          style={{ display: "inline-block" }}
        />
        <div className="accept-call__buttons">
          <IconButton
            color="green"
            icon="phone_in_talk"
            onClick={() => answerCall(currentCall.chatId)}
          />
          <IconButton
            onClick={() => leaveCall(currentCall.chatId)}
            color="red"
            icon="phone_disabled"
          />
        </div>
      </div>
    </Card>
  ) : (
    <></>
  );
};

export default AcceptCall;
