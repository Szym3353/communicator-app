const User = require("../models/user");

module.exports = (io, socket) => {
  const statusChange = async (payload) => {
    let user = await User.findByIdAndUpdate(payload.id, {
      activityStatus: { currentStatus: "online", socketId: socket.id },
    });

    user.contacts.forEach(async (el) => {
      if (el.defaultContact) return;

      let contactUser = await User.findById(el.id);

      if (
        contactUser.activityStatus.currentStatus === "offline" ||
        contactUser.activityStatus.socketId === ""
      )
        return;
      io.to(contactUser.activityStatus.socketId).emit("contact:changeStatus", {
        contactId: user._id,
        status: "online",
      });
    });
  };

  socket.on("user:setStatus:online", statusChange);
};
