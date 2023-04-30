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
            newMessage: true,
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
                contacts: {
                  $each: [{ ...checkIfContactOnList, newMessage: true }],
                  $position: 0,
                },
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

  const readMessage = async (payload) => {
    try {
      let chat = await Chat.findById(payload.chatId);
      if (
        chat.messages.some(
          (el) => el.read.findIndex((el2) => el2 === payload.userId) === -1
        )
      ) {
        await Chat.findByIdAndUpdate(chat._id, {
          $addToSet: { "messages.$[].read": payload.userId },
        });
      }

      let user = await User.findById(payload.userId);
      if (user) {
        user.contacts.find(
          (el) => el.id === payload.messageAuthor
        ).newMessage = false;
        await user.save();
      }

      let author = await User.findById(payload.messageAuthor);
      if (!author || author.activityStatus.currentStatus === "offline") return;

      io.to(author.activityStatus.socketId).emit("message:read:author", {
        chatId: payload.chatId,
        userId: payload.userId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const callUser = async (payload, callback) => {
    try {
      let chat = await Chat.findById(payload.chatId);
      if (!chat) return;

      //Check if receiver is online
      let contactUser = await User.findById(
        chat.users.filter((el) => el !== payload.userId)[0]
      );
      if (
        contactUser.defaultContact ||
        contactUser.activityStatus.currentStatus === "offline" ||
        contactUser.activityStatus.currentStatus === "hidden"
      )
        return callback(null, "User is currently offline");

      //Check if users are on each other contacts list
      if (
        contactUser.contacts.findIndex((el) => el.id === payload.userId) === -1
      )
        return;

      //Create call in chat
      let call = {
        chatId: payload.chatId,
        started: new Date().toISOString(),
        signal: payload.signal,
        users: [
          {
            ...chat.usersDetails.find((el) => el.id === payload.userId)._doc,
          },
        ],
      };

      callback({
        ...call,
        accepted: true,
      });

      io.to(contactUser.activityStatus.socketId).emit("call:receive", {
        ...call,
        accepted: false,
      });
    } catch (error) {
      console.log("err", error);
    }
  };

  const acceptCall = async (payload) => {
    try {
      let chat = await Chat.findById(payload.chatId);
      if (!chat) return;

      //Get calling user
      let callingUser = await User.findById(
        chat.users.find((el) => el !== payload.userId)
      );
      if (
        !callingUser ||
        callingUser.activityStatus.currentStatus === "offline" ||
        callingUser.activityStatus.currentStatus === "hidden"
      )
        return;

      /* await Chat.findByIdAndUpdate(payload.chatId, {
        $push: { "call.users": payload.userId },
      });
 */

      //Emit join
      if (callingUser.activityStatus.socketId) {
        io.to(callingUser.activityStatus.socketId).emit("call:join", {
          signal: payload.signalData,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* const getCall = async (payload, callback) => {
    try {
      let chat = await Chat.findById(payload.chatId);
      if (!chat || !chat.call) return;

      let contactUser = await User.findById(
        chat.users.find((el) => el !== payload.userId)
      );
      if (contactUser.activityStatus.currentStatus === "offline") return;

      io.to(contactUser.activityStatus.socketId).emit("call:resendRequest", {
        chatId: payload.chatId,
      });
    } catch (error) {
      console.log("get error", error);
      callback(error);
    }
  };

  const resendCall = async (payload) => {
    console.log("check1a", payload.chatId, payload.call);
    try {
      if (!payload.call) return;
      let chat = await Chat.findById(payload.call.chatId);
      if (!chat || !chat.call) return;

      let contactUser = await User.findById(
        chat.users.find((el) => el !== payload.userId)
      );
      if (contactUser.activityStatus.currentStatus === "offline") return;

      io.to(contactUser.activityStatus.socketId).emit("call:receive", {
        ...payload.call,
        accepted: false,
      });
    } catch (error) {
      console.log(error);
    }
  }; */

  const toggleInCall = async (payload) => {
    try {
      //let chat = await Chat.findOne({ "chat.call.users": payload.userId });
      /* if (
        !chat ||
        !chat.call ||
        chat.call.users.findIndex((el) => el === payload.userId) === -1
      )
        return; */

      let chat = await Chat.findById(payload.chatId);
      if (!chat) return;

      let contactUser = await User.findById(
        chat.users.find((el) => el !== payload.userId)
      );

      if (contactUser.activityStatus.currentStatus === "offline") return;
      io.to(contactUser.activityStatus.socketId).emit("call:toggle", {
        userId: payload.userId,
        arg: payload.arg,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const leaveCall = async (payload) => {
    try {
      let chat = await Chat.findById(payload.chatId);
      if (!chat) return;

      let contactUser = await User.findById(
        chat.users.find((el) => el !== payload.userId)
      );

      if (
        !contactUser ||
        contactUser.activityStatus.currentStatus === "offline"
      )
        return;
      io.to(contactUser.activityStatus.socketId).emit("call:userLeft", {
        chatId: payload.chatId,
      });
    } catch (error) {}
  };

  socket.on("message:send", sendMessage);
  socket.on("call:start", callUser);
  socket.on("call:accept", acceptCall);
  socket.on("call:leave", leaveCall);
  //socket.on("call:get", getCall);
  //socket.on("call:resend", resendCall);
  socket.on("call:toggle", toggleInCall);
  socket.on("message:read:contact", readMessage);
};
