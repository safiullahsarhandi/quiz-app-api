const moment = require("moment");

const User = require("../models/User");

const { validateEmail } = require("../validations");

const { delete_file } = require("../services/delete_file");

exports.logs = async (req, res) => {
  try {
    const searchParam =
      req.query.searchString && !validateEmail(req.query.searchString)
        ? {
            name: { $regex: `${req.query.searchString}`, $options: "i" },
          }
        : {};
    const searchEmail = req.query.searchString
      ? validateEmail(req.query.searchString)
        ? {
            email: {
              $regex: `${req.query.searchString}`,
              $options: "i",
            },
          }
        : {}
      : {};
    const from = req.query.from ? req.query.from : null;
    const to = req.query.to ? req.query.to : null;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment(new Date(from)).startOf("day"),
          $lte: moment(new Date(to)).endOf("day"),
        },
      };
    const status_filter = req.query.status
      ? { status: JSON.parse(req.query.status) }
      : {};
    const logs = await User.paginate(
      {
        ...searchParam,
        ...dateFilter,
        ...status_filter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: {
          path: "auth",
          select: "email",
          match: {
            ...searchEmail,
          },
        },
        select: "auth name createdAt status ratings",
      }
    );

    logs.docs = logs.docs.filter((doc) => doc.auth);

    await res.status(200).json({
      logs,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = !user.status;
    await user.save();
    await res.status(201).json({
      message: user.status ? "User Activated" : "User Deactivated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("auth", "email")
      .lean();
    await res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.updateUserAdmin = async (req, res) => {
  try {
    const { id, name } = req.body;

    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;

    const user = await User.findById(id);
    const old_user_image = user.user_image;

    user.name = name;
    user.user_image = user_image ? user_image : user.user_image;

    await user.save();

    await res.status(201).json({
      message: "Player Updated",
    });

    if (user_image && old_user_image) delete_file(old_user_image);
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
