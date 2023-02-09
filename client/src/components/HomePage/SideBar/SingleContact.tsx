import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { getChatRoom } from "../../../store/chat";
import { contact } from "../../../store/user";
import Avatar from "../../styled/Avatar";

const styles = {
  newMessage: {
    color: "#111",
    fontWeight: "700",
  },
};

const SingleContact = ({ contact }: { contact: contact }) => {
  let dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="single-contact-container"
      onClick={() => dispatch(getChatRoom(contact.id))}
    >
      <Avatar
        status={contact.activityStatus.currentStatus}
        size="50px"
        src={contact.avatarURL}
      />
      <p
        className="single-contact-username"
        style={
          contact.newMessage
            ? styles.newMessage
            : { color: "#555", fontWeight: 400 }
        }
      >
        {contact.username}
      </p>
    </div>
  );
};

export default SingleContact;
