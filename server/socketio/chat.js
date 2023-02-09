const Chat = require("../models/chat");
const User = require("../models/user");

module.exports = (io, socket) => {
  const sendMessage = async (payload, callback) => {
    try {
      let newMessage = {
        author: payload.authorId,
        date: new Date().toISOString(),
        content: payload.message,
        read: [payload.authorId],
      };

      let chat = await Chat.findByIdAndUpdate(payload.chatId, {
        $push: {
          messages: { $each: [newMessage], $position: 0 },
        },
      });

      let users = await User.find({ _id: { $in: chat.users } });

      let receivers = users.filter(
        (el) => el._id.toHexString() !== payload.authorId
      );
      let author = users.find(
        (el) => el._id.toHexString() === payload.authorId
      )[0];

      receivers.forEach(async (el) => {
        if (el.defaultContact || !el.activityStatus.socketId) return;

        let authorContact = false;
        let checkIfContactOnList = el.contacts.find(
          (contact) => contact.id == payload.authorId
        );

        if (!checkIfContactOnList) {
          authorContact = {
            id: author._id,
            username: author.username,
            avatarURL: author.avatarURL,
            contactType: "temporary",
            activityStatus: author.activityStatus,
          };

          await User.findByIdAndUpdate(el._id, {
            $push: {
              contacts: { $each: [authorContact], $position: 0 },
            },
          });
        } else {
          await User.findByIdAndUpdate(el._id, {
            $pull: { contacts: { id: payload.authorId } },
          }).then(async () => {
            await User.findByIdAndUpdate(el._id, {
              $push: {
                contacts: { $each: [checkIfContactOnList], $position: 0 },
              },
            });
          });
        }

        io.to(el.activityStatus.socketId).emit("message:receive", {
          message: { ...newMessage, chatId: payload.chatId },
          contact: authorContact,
        });
      });

      callback({ ...newMessage, chatId: payload.chatId });
    } catch (error) {
      console.log("er", error);
    }
  };

  socket.on("message:send", sendMessage);
};
