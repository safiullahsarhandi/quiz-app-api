"use strict";

const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  registerUser,
  loginUser,
} = require("../controllers/auth");

// @ADMIN ROUTES
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

// @USER ROUTES
router.post("/user/login", loginUser);
router.post("/user/register", registerUser);

// @GENERAL ROUTES
router.post("/recover", recoverPassword);
router.post("/verify", verifyRecoverCode);
router.post("/reset", resetPassword);

module.exports = router;
