import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { getChatRoom } from "../../../store/chat";
import { contact } from "../../../store/user";
import Avatar from "../../styled/Avatar";

const styles = {
  newMessage: {
    color: "#eee",
    fontWeight: "500",
  },
};

const SingleContact = ({ contact }: { contact: contact }) => {
  let dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="single-contact"
      onClick={() => dispatch(getChatRoom(contact.id))}
    >
      <Avatar
        status={contact.activityStatus.currentStatus}
        size="40px"
        src={contact.avatarURL}
      />
      <p
        className="single-contact__username"
        style={
          contact.newMessage
            ? styles.newMessage
            : { color: "rgba(255,255,255,0.55)", fontWeight: 400 }
        }
      >
        {contact.username}
      </p>
    </div>
  );
};

export default SingleContact;
