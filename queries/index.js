const moment = require("moment");

const Auth = require("../models/Auth");
const User = require("../models/User");
const Reset = require("../models/Reset");
const Notification = require("../models/Notification");

exports.getUserForAuth = async (email) =>
  await Auth.findOne({ email: email.toLowerCase() }).populate(
    "admin_auth user_auth"
  );

exports.getUserForProfile = async (id) =>{
  try {
    
    return await User.findById(id).populate("auth", "email");
  } catch (error) {
      console.log(error);
  }
}

exports.createResetToken = async (email, code) => {
  const token = await Reset.findOne({ email });
  if (token) await token.remove();
  const newToken = new Reset({
    email,
    code,
  });
  await newToken.save();
};

exports.validateCode = (code, email) => Reset.findOne({ code, email });

exports.allUsersGraph = async (year) => {
  try {
    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const start_date = moment(year).startOf("year").toDate();
    const end_date = moment(year).endOf("year").toDate();
    const query = [
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date,
          },
        },
      },
      {
        $addFields: {
          date: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1,
        },
      },
    ];
    const user_data = await User.aggregate(query);
    user_data.forEach((data) => {
      if (data) arr[data.month - 1] = data.count;
    });
    return arr;
  } catch (err) {
    return err;
  }
};

exports.getNotificationCount = async (is_admin, user) => {
  const user_filter = user ? { userId: user } : {};
  const admin_filter = is_admin ? { to: "Admin" } : {};
  const count = await Notification.find({
    ...user_filter,
    ...admin_filter,
    read: false,
  }).countDocuments();
  return count;
};
