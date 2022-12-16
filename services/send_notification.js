const Notification = require("../models/Notification");

const SendNotification = async (data, session) => {
  try {
    const { message, to, userId, payload } = data;

    const notification = new Notification({
      message,
      to,
      userId,
      payload,
    });

    await notification.save(session);
    return notification._id;
  } catch (error) {
    console.log("error", error);
    throw new Error(error.toString());
  }
};

exports.registerUserNotification = async (user, session) => {
  await SendNotification(
    {
      message: `A New User Has Been Registered.`,
      to: "Admin",
      payload: {
        payloadType: "User",
        id: user._id,
      },
    },
    session
  );
};
