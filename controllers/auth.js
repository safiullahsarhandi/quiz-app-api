const Auth = require("../models/Auth");
const User = require("../models/User");
const Admin = require("../models/Admin");

const { generateEmail } = require("../services/generate_email");
const { generateHash } = require("../services/generate_hash");
const { generateToken } = require("../services/generate_token");
const { generateCode } = require("../services/generate_code");
const {
  userExists,
  validateEmail,
  verifyPassword,
  comparePassword,
} = require("../validations");
const {
  getUserForAuth,
  createResetToken,
  validateCode,
  getUserForProfile,
} = require("../queries");
const { delete_file } = require("../services/delete_file");
const { registerUserNotification } = require("../services/send_notification");
const Setting = require("../models/Setting");

// @ADMIN APIs
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email: _email, password } = req.body;
    const email = validateEmail(_email);
    if (!email) throw new Error("Invalid Email Address");
    if (await userExists(email)) throw new Error("Email Already Registered");
    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    const auth = new Auth({
      email,
      password: await generateHash(password),
    });
    const admin = new Admin({
      name,
      auth: auth._id,
      user_image,
    });
    auth.user = admin._id;
    await admin.save();
    await auth.save();
    await res.status(201).json({
      message: "Admin Created",
    });
  } catch (err) {
    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    if (user_image) delete_file(user_image);
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password, remember_me } = req.body;
    const admin = await getUserForAuth(email);
    if (!admin)
      return res.status(400).json({ message: "Invlaid Email/Password" });
    const isEqual = await verifyPassword(password, admin.password);
    if (!isEqual)
      return res.status(400).json({ message: "Invlaid Email/Password" });
    const token = await generateToken(
      admin.email,
      admin.admin_auth._id,
      process.env.JWT_SECRET,
      { is_admin: true },
      { expiresIn: remember_me ? "365d" : "14400000" }
    );
    await res.status(200).json({
      message: "Admin Logged In",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

// @USER APIs
exports.registerUser = async (req, res) => {
  const session = await Auth.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const { name, email: _email, password } = req.body;
    const email = validateEmail(_email);

    if (!email) throw new Error("Invalid Email Address");

    if (await userExists(email)) throw new Error("Email Already Registered");

    /* const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path; */

    const auth = new Auth({
      email,
      password: await generateHash(password),
    });

    const user = new User({
      name,
      auth: auth._id,
      // user_image,
      status: true,
    });

    auth.user = user._id;
    // store default setting
    const setting = new  Setting({
        userId : user._id,
        noOfPlayers: 3,
        timer: 30, 
        rounds: 3,
        sound : 0,
    });

    await user.save(opts);
    await auth.save(opts);
    await setting.save(opts);
    
    await registerUserNotification(user, opts);
    
    await session.commitTransaction(opts);
    session.endSession(opts);

    await res.status(201).json({
      message: "User Registered",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    if (user_image) delete_file(user_image);
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserForAuth(email);
    if (!user) throw new Error("Invlaid Email/Password");

    const isEqual = await verifyPassword(password, user.password);
    if (!isEqual) throw new Error("Invlaid Email/Password");

    const user_to_send = await getUserForProfile(user.user_auth._id);
    if (!user_to_send.status)
      throw new Error("You Have Been Blocked By The Admin");

    const token = await generateToken(
      user.email,
      user.user_auth._id,
      process.env.JWT_SECRET,
      { is_user: true }
    );

    await res.status(200).json({
      message: "User Logged In",
      token,
      user: user_to_send,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

// @GENERAL APIs
exports.recoverPassword = async (req, res) => {
  try {
    const { email: _email } = req.body;
    const email = validateEmail(_email);
    if (!email)
      return res.status(400).json({ message: "Invalid Email Address",status : false, });
    const user = await getUserForAuth(email);
    if (!user)
      return res.status(400).json({ message: "Invalid Email Address",status : false, });
    const status = generateCode();
    await createResetToken(email, status);
    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
    \n\n Your verification status is ${status}:\n\n
    \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
    </p>`;
    await generateEmail(email, "Jackass OR Saints - Password Reset", html);
    return res.status(201).json({
      status : true,
      message:
        "Recovery status Has Been Emailed To Your Registered Email Address",
    });
  } catch (err) {
    res.status(500).json({
      status : false,
      message: err.toString(),
    });
  }
};

exports.verifyRecoverCode = async (req, res) => {
  try {
    const { code, email: _email } = req.body;
    const email = validateEmail(_email);
    if (!email)
      return res.status(400).json({ message: "Invalid Email Address" });
    const is_valid = await validateCode(code, email);
    if (is_valid)
      return res.status(200).json({ message: "Recovery Code Accepted", status : true, });
    else return res.status(400).json({ message: "Invalid Recovery Code",status : false, });
  } catch (err) {
    res.status(500).json({
      status : false,
      message: err.toString(),
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirm_password, code, email: _email } = req.body;
    const email = validateEmail(_email);
    if (!email)
      return res.status(400).json({ message: "Invalid Email Address", status : false });
    if (!comparePassword(password, confirm_password))
      throw new Error("Password Not Equal");
    const reset_status = await validateCode(code, email);
    if (!reset_status)
      return res.status(400).json({ message: "Invalid Recovery status" , status : false});
    const user = await getUserForAuth(email);
    user.password = await generateHash(password);
    await user.save();
    await reset_status.deleteOne();
    await res.status(201).json({
      message: "Password Updated",
      status : true
    });
    
  } catch (err) {
    res.status(500).json({
      status : false,
      message: err.toString(),
    });
  }
};
