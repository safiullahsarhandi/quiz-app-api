const Notification = require("../models/Notification");
const { getNotificationCount } = require("../queries");

exports.getNotificationAdmin = async (req, res) => {
  try {
    const notifications = await Notification.paginate(
      {
        to: "Admin",
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
      }
    );
    await res.status(200).json({
      notifications,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getNotificationCount = async (req, res) => {
  try {
    const count = await getNotificationCount(true);
    res.status(200).json({
      count,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.readNotification = async (req, res) => {
  try {
    req.scope.is_admin
      ? await Notification.updateOne({ _id: req.params.id }, { read: true })
      : await Notification.updateOne(
          { _id: req.params.id, userId: req.userId },
          { read: true }
        );
    await res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
