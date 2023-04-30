const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    defaultContact: Boolean,
    username: String,
    password: String,
    email: String,
    avatarURL: String,
    city: String,
    country: String,
    registered: String,
    code: String,
    settings: {
      phone: String,
      lastStatus: String,
    },
    activityStatus: {
      currentStatus: String,
      socketId: String,
    },
    contacts: [
      {
        newMessage: Boolean,
        username: String,
        avatarURL: String,
        id: String,
        contactType: String,
      },
    ],
  },
  { collection: "users" }
);

module.exports = model("User", userSchema);
