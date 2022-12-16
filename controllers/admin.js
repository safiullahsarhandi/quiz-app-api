const bcrypt = require("bcryptjs");

const Auth = require("../models/Auth");
const Admin = require("../models/Admin");

const { delete_file } = require("../services/delete_file");

exports.me = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId)
      .populate("auth", "email")
      .lean();
    await res.status(200).json({ admin });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { name, user_image } = req.body;
    let new_user_image;
    new_user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    const admin = await Admin.findById(req.userId).populate("auth", "email");
    if (new_user_image) delete_file(admin.user_image);
    admin.name = name;
    admin.user_image = new_user_image ? new_user_image : user_image;
    await admin.save();
    await res.status(201).json({
      message: "Admin Updated",
      admin,
    });
  } catch (err) {
    let new_user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    if (new_user_image) delete_file(new_user_image);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(422).json({
        message: "Password Doesn't Match",
      });
    }
    const user = await Auth.findOne({ user: req.userId });
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(422).json({
        message: "Invalid Password",
      });
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    await res.status(201).json({
      message: "Password Updated",
    });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};
