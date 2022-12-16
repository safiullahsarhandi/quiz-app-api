"use strict";

const express = require("express");
const router = express.Router();

const AdminAuth = require("../middlewares/AdminAuth");

const {
  logs,
  changeStatus,
  userDetails,
  updateUserAdmin,
} = require("../controllers/user");

// @ADMIN ROUTES
router.get("/admin/logs", AdminAuth, logs);
router.get("/admin/status/:id", AdminAuth, changeStatus);
router.get("/admin/details/:id", AdminAuth, userDetails);
router.post("/admin/update", AdminAuth, updateUserAdmin);

module.exports = router;
